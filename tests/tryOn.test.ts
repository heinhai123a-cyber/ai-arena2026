import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCloudflareImageRequest,
  buildImageEditPrompt,
  classifyCloudflareError,
  getCloudflareImage,
  MAX_PROMPT_LENGTH,
  validateTryOnInput,
} from '../server/tryOnUtils.js';

describe('AI try-on request validation', () => {
  test('requires explicit consent before accepting a request', () => {
    assert.match(
      validateTryOnInput({ prompt: 'Áo dài lụa đỏ son', aspectRatio: '4:5', consent: 'false' }) || '',
      /đồng ý gửi ảnh/
    );
  });

  test('rejects short and oversized prompts', () => {
    assert.match(
      validateTryOnInput({ prompt: 'áo', aspectRatio: '4:5', consent: 'true' }) || '',
      /ít nhất 8/
    );
    assert.match(
      validateTryOnInput({ prompt: 'a'.repeat(MAX_PROMPT_LENGTH + 1), aspectRatio: '4:5', consent: 'true' }) || '',
      /700 ký tự/
    );
  });

  test('accepts supported ratios and rejects arbitrary output settings', () => {
    assert.equal(validateTryOnInput({ prompt: 'Áo dài lụa màu đỏ', aspectRatio: '4:5', consent: 'true' }), null);
    assert.equal(validateTryOnInput({ prompt: 'Áo dài lụa màu đỏ', aspectRatio: '9:16', consent: 'true' }), null);
    assert.match(
      validateTryOnInput({ prompt: 'Áo dài lụa màu đỏ', aspectRatio: '1:1', consent: 'true' }) || '',
      /Tỷ lệ ảnh/
    );
  });

  test('image-edit prompt asks model to preserve identity and alter styling only', () => {
    const prompt = buildImageEditPrompt('Áo dài màu ngọc');
    assert.match(prompt, /Keep the same person recognizable/);
    assert.match(prompt, /Change the clothing and styling only/);
    assert.match(prompt, /Áo dài màu ngọc/);
  });

  test('builds Cloudflare multipart request with binary image, prompt, and selected ratio', async () => {
    const request = buildCloudflareImageRequest(Buffer.from('portrait'), 'Áo dài lụa đỏ', '9:16');
    assert.ok(request instanceof FormData);
    assert.match(String(request.get('prompt')), /Áo dài lụa đỏ/);
    assert.equal(request.get('width'), '720');
    assert.equal(request.get('height'), '1280');
    assert.equal(request.get('strength'), '0.65');
    const uploadedImage = request.get('image');
    assert.ok(uploadedImage instanceof Blob);
    assert.equal(uploadedImage.type, 'image/jpeg');
    assert.equal(Buffer.from(await uploadedImage.arrayBuffer()).toString(), 'portrait');
  });

  test('extracts Cloudflare image output and rejects empty provider responses', () => {
    assert.equal(getCloudflareImage({ success: true, result: { image: 'aW1hZ2U=' } }), 'aW1hZ2U=');
    assert.throws(() => getCloudflareImage({ success: true, result: {} }), /không trả về ảnh/);
  });

  test('separates daily free allocation exhaustion from temporary rate limiting', () => {
    const quota = classifyCloudflareError({ status: 429, message: 'Daily free allocation exceeded: neurons.' });
    const rateLimit = classifyCloudflareError({ status: 429, message: 'Requests per minute exceeded. Retry after a short delay.' });

    assert.equal(quota.kind, 'cloudflare-daily-limit');
    assert.match(quota.error, /00:00 UTC/);
    assert.equal(rateLimit.kind, 'cloudflare-rate-limit');
    assert.match(rateLimit.error, /Chờ một lúc/);
  });

  test('redacts provider token from diagnostics', () => {
    const token = 'cf_secret_token_value';
    const failure = classifyCloudflareError({
      status: 429,
      message: `quota exceeded; Bearer ${token}`,
    }, token);
    assert.doesNotMatch(failure.providerMessage, new RegExp(token));
    assert.match(failure.providerMessage, /redacted/);
  });
});