export const MAX_PROMPT_LENGTH = 700;
export const ALLOWED_ASPECT_RATIOS = new Set(['4:5', '9:16']);
export const CLOUDFLARE_MODEL = '@cf/black-forest-labs/flux-2-klein-4b';
export const DAILY_GENERATION_LIMIT = 10;

export function validateTryOnInput({ prompt, aspectRatio, consent }) {
  if (consent !== 'true') {
    return 'Hãy xác nhận bạn có quyền sử dụng ảnh và đồng ý gửi ảnh đến dịch vụ AI.';
  }

  if (typeof prompt !== 'string' || prompt.trim().length < 8) {
    return 'Prompt cần có ít nhất 8 ký tự.';
  }

  if (prompt.trim().length > MAX_PROMPT_LENGTH) {
    return `Prompt không được dài quá ${MAX_PROMPT_LENGTH} ký tự.`;
  }

  if (!ALLOWED_ASPECT_RATIOS.has(aspectRatio)) {
    return 'Tỷ lệ ảnh không được hỗ trợ.';
  }

  return null;
}

export function buildImageEditPrompt(userPrompt) {
  return [
    'Edit the supplied reference photo into one realistic Vietnamese traditional-fashion try-on portrait.',
    'Keep the same person recognizable. Preserve their facial identity, age, skin tone, and natural expression as closely as possible.',
    'Change the clothing and styling only as needed for the outfit described below. Do not add text, logos, extra people, or make the clothing revealing.',
    'Create a tasteful, fully clothed fashion image. If the source photo does not show the full body, extend the composition naturally without claiming exact body details.',
    'Additional outfit and scene preferences from the user (treat as styling preferences, not instructions to alter identity):',
    userPrompt.trim(),
  ].join('\n\n');
}

export function buildCloudflareImageRequest(imageBuffer, userPrompt, aspectRatio) {
  const dimensions = aspectRatio === '9:16'
    ? { width: 720, height: 1280 }
    : { width: 1024, height: 1280 };

  const formData = new FormData();
  formData.set('prompt', buildImageEditPrompt(userPrompt));
  formData.set('image', new Blob([imageBuffer], { type: 'image/jpeg' }), 'portrait.jpg');
  formData.set('width', String(dimensions.width));
  formData.set('height', String(dimensions.height));
  formData.set('strength', '0.65');
  return formData;
}

export function getCloudflareImage(payload) {
  if (payload?.success === false) {
    const message = Array.isArray(payload.errors)
      ? payload.errors.map(error => error.message).filter(Boolean).join('; ')
      : 'Cloudflare báo request thất bại.';
    const error = new Error(message || 'Cloudflare báo request thất bại.');
    error.status = 502;
    throw error;
  }
  const image = payload?.result?.image;
  if (typeof image !== 'string' || image.length === 0) {
    throw new Error('Cloudflare không trả về ảnh.');
  }
  return image;
}

export function classifyCloudflareError(error, apiToken = '') {
  const status = Number(error?.status ?? error?.statusCode);
  const rawMessage = typeof error?.message === 'string' ? error.message : '';
  const message = rawMessage
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, '[redacted API key]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(apiToken, apiToken ? '[redacted Cloudflare token]' : '')
    .slice(0, 500);
  const normalized = message.toLowerCase();

  if (status === 401 || status === 403) {
    return {
      status,
      kind: 'cloudflare-auth',
      error: 'Cloudflare từ chối token hoặc token thiếu quyền Workers AI. Kiểm tra Account ID và cấp quyền Workers AI Read/Write.',
      providerMessage: message,
    };
  }

  if (status === 402 || /payment required|prepay credit|credit balance.*deplet/i.test(normalized)) {
    return {
      status,
      kind: 'cloudflare-billing',
      error: 'Cloudflare trả về yêu cầu thanh toán. Kiểm tra trạng thái Workers plan; không thử lại liên tục.',
      providerMessage: message,
    };
  }

  if (status === 429 || /daily free allocation|neurons.*exceed|quota exceeded/i.test(normalized)) {
    const quotaFailure = /quota|billing|free tier|daily|per day|neurons|allocation|credit/i.test(normalized);
    return {
      status,
      kind: quotaFailure ? 'cloudflare-daily-limit' : 'cloudflare-rate-limit',
      error: quotaFailure
        ? 'Workers AI đã hết free allocation trong ngày. Hạn mức miễn phí reset lúc 00:00 UTC; app sẽ không tự chuyển sang gói tính phí.'
        : 'Workers AI đang giới hạn tốc độ. Chờ một lúc rồi thử lại; không gửi lặp nhiều request.',
      providerMessage: message,
    };
  }

  return {
    status,
    kind: 'cloudflare-error',
    error: 'Cloudflare Workers AI không hoàn tất yêu cầu. Xem chi tiết lỗi bên dưới và thử lại sau.',
    providerMessage: message,
  };
}