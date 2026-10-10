import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  buildCloudflareImageRequest,
  classifyCloudflareError,
  CLOUDFLARE_MODEL,
  DAILY_GENERATION_LIMIT,
  getCloudflareImage,
  validateTryOnInput,
} from './tryOnUtils.js';

const app = express();
const port = Number(process.env.PORT) || 8787;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const maxImageBytes = 8 * 1024 * 1024;
const maxImagePixels = 40_000_000;
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageBytes, files: 1, fields: 3, parts: 4, fieldSize: 1200 },
  fileFilter(_request, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Hãy chọn ảnh JPG, PNG hoặc WebP.'));
      return;
    }
    callback(null, true);
  },
});

const generationLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Bạn đã dùng hết lượt thử trong 15 phút. Vui lòng quay lại sau.' },
});
const dailyGenerationLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: DAILY_GENERATION_LIMIT,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: `Đã đạt giới hạn demo ${DAILY_GENERATION_LIMIT} lượt/ngày trên server này.` },
});

app.disable('x-powered-by');
app.use('/api', (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({
    configured: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
    provider: 'Cloudflare Workers AI',
    model: process.env.CLOUDFLARE_IMAGE_MODEL || CLOUDFLARE_MODEL,
  });
});

app.post('/api/try-on', generationLimit, dailyGenerationLimit, upload.single('photo'), async (request, response) => {
  const inputError = validateTryOnInput({
    prompt: request.body?.prompt,
    aspectRatio: request.body?.aspectRatio,
    consent: request.body?.consent,
  });

  if (inputError) {
    response.status(400).json({ error: inputError });
    return;
  }

  if (!request.file) {
    response.status(400).json({ error: 'Vui lòng chọn một ảnh chân dung.' });
    return;
  }

  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    response.status(503).json({ error: 'Cần cấu hình CLOUDFLARE_ACCOUNT_ID và CLOUDFLARE_API_TOKEN trên server.' });
    return;
  }

  try {
    const image = sharp(request.file.buffer, { limitInputPixels: maxImagePixels, failOn: 'error' });
    const metadata = await image.metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '') || !metadata.width || !metadata.height) {
      response.status(415).json({ error: 'File này không phải ảnh JPG, PNG hoặc WebP hợp lệ.' });
      return;
    }
    if (metadata.width * metadata.height > maxImagePixels) {
      response.status(413).json({ error: 'Ảnh có độ phân giải quá lớn. Hãy chọn ảnh nhỏ hơn.' });
      return;
    }

    const normalizedImage = await sharp(request.file.buffer, { limitInputPixels: maxImagePixels })
      .rotate()
      .resize({ width: 1536, height: 1536, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88 })
      .toBuffer();

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model = process.env.CLOUDFLARE_IMAGE_MODEL || CLOUDFLARE_MODEL;
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: buildCloudflareImageRequest(normalizedImage, request.body.prompt, request.body.aspectRatio),
        signal: AbortSignal.timeout(90_000),
      }
    );
    const providerPayload = await cloudflareResponse.json().catch(() => ({}));
    if (!cloudflareResponse.ok || providerPayload.success === false) {
      const providerError = Array.isArray(providerPayload.errors)
        ? providerPayload.errors.map(providerIssue => providerIssue.message).filter(Boolean).join('; ')
        : '';
      const providerRequestError = new Error(providerError || `Cloudflare API returned HTTP ${cloudflareResponse.status}`);
      providerRequestError.status = cloudflareResponse.status;
      throw providerRequestError;
    }

    response.json({
      imageData: getCloudflareImage(providerPayload),
      mimeType: 'image/png',
      provider: 'Cloudflare Workers AI',
      model,
    });
  } catch (error) {
    const status = Number(error?.status ?? error?.statusCode);
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      response.status(413).json({ error: 'Ảnh vượt quá giới hạn 8 MB.' });
      return;
    }
    if (error?.name === 'Error' && /unsupported image|input buffer/i.test(error.message)) {
      response.status(415).json({ error: 'Không đọc được ảnh này. Hãy chọn JPG, PNG hoặc WebP.' });
      return;
    }

    const failure = classifyCloudflareError(error, process.env.CLOUDFLARE_API_TOKEN);
    console.error('Cloudflare try-on failed:', JSON.stringify({
      status: failure.status || status || 'unknown',
      kind: failure.kind,
      providerMessage: failure.providerMessage,
    }));
    response.status(status >= 400 && status < 600 ? status : 502).json({
      error: failure.error,
      errorKind: failure.kind,
      providerMessage: failure.providerMessage,
    });
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    response.status(413).json({ error: 'Ảnh vượt quá giới hạn 8 MB.' });
    return;
  }
  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: 'Yêu cầu ảnh không hợp lệ.' });
    return;
  }
  if (error?.message === 'Hãy chọn ảnh JPG, PNG hoặc WebP.') {
    response.status(415).json({ error: error.message });
    return;
  }
  console.error('Request processing failed:', error?.name || 'UnknownError');
  response.status(400).json({ error: 'Không xử lý được yêu cầu. Hãy kiểm tra lại ảnh và thử lại.' });
});

app.use(express.static(path.join(projectRoot, 'dist'), { index: false }));
app.use((request, response, next) => {
  if (request.method === 'GET' && !request.path.startsWith('/api/')) {
    response.sendFile(path.join(projectRoot, 'dist', 'index.html'), error => {
      if (error) next(error);
    });
    return;
  }
  next();
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Việt Phục Remix server listening on port ${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.warn(`Port ${port} is currently busy, waiting for release...`);
    setTimeout(() => {
      server.close();
      server.listen(port, '0.0.0.0');
    }, 1200);
  } else {
    console.error('Server error:', err);
  }
});