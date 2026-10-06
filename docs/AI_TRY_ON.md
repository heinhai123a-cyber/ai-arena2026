# AI Try-On

## What It Does

The optional AI Try-On page accepts one portrait photo and a short outfit prompt, sends them to Cloudflare Workers AI `@cf/black-forest-labs/flux-2-klein-4b`, and returns one generated image in 4:5 or 9:16 format. It does not guarantee exact identity, garment construction, or historical accuracy.

## Local Setup

1. Use Node.js 22.9 or later.
2. Create a Cloudflare account and a Workers AI API token. The token needs Workers AI permissions; keep the account on Workers Free to avoid paid overage.
3. Copy `.env.example` to `.env` and set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` locally. Never paste the token into frontend source, chat, or a committed file.
4. Run `npm install` and `npm run dev` from the project directory.
5. Open `http://localhost:5173/#/ai-try-on`.

The dev command starts Vite and the Express API. Vite proxies `/api` to the local API server on port 8787.

## Image And Prompt Handling

- Accepts JPEG, PNG, and WebP up to 8 MB; server checks decoded format and pixel dimensions and resizes to at most 1536 pixels per side.
- The upstream Cloudflare call uses `multipart/form-data` with a binary `image` file plus `prompt`, `width`, `height`, and `strength` fields. Node `fetch` creates the multipart boundary; do not set `Content-Type` manually.
- Image processing uses memory buffers. The app does not write uploads or generated results to a database or disk.
- The client requires explicit consent. It keeps the selected photo and generated result in temporary browser object URLs; refreshing or leaving the page clears them.
- The server sends the photo and prompt to Cloudflare Workers AI and does not persist either in the app.
- Review [Cloudflare's privacy policy](https://www.cloudflare.com/privacypolicy/) and [FLUX terms](https://bfl.ai/legal/terms-of-service) before uploading personal photos.
- The API route is limited to three requests per 15 minutes per server-observed IP. Configure proxy trust carefully when deploying behind a reverse proxy.
- The app server has an additional 10-request daily limit per IP/process. This counter resets if the server restarts and is not a substitute for provider-level account limits.

## Deployment

The AI feature requires a Node.js host. Build with `npm run build`, set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as host secrets, and start with `npm start`. The Express server serves `dist/` and `/api` from the same origin. GitHub Pages or any static-only host cannot run this endpoint.

## Quality And Safety Limits

FLUX.2 [klein] can refuse requests, return no image, change facial details, or misrepresent historical garments. The UI labels outputs as AI-generated. Do not describe the result as a factual historical reconstruction. Do not upload another person's image without their permission.

The token remains server-side. This MVP does not provide accounts, a CAPTCHA, or a distributed rate-limit store. Cloudflare Workers AI currently provides 10,000 free neurons per day on Workers Free; usage beyond that free allocation fails unless the account is upgraded. See [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) and [limits](https://developers.cloudflare.com/workers-ai/platform/limits/).

## Free Quota And 429 Errors

The current Workers AI free allocation is 10,000 neurons/day per account, resetting at 00:00 UTC. `FLUX.2 [klein]` charges neurons for both the input and output image. This app caps each IP at 10 requests/day and 3 requests per 15 minutes per process; counters reset if the server restarts. Keep the Cloudflare account on Workers Free. On Workers Paid, usage above the free allocation may be billed.

HTTP 429 may indicate daily free quota or a temporary rate limit. The server displays Cloudflare's sanitized provider message and links to the Workers AI dashboard. Do not retry repeatedly after a daily quota error; wait for reset.

- [Cloudflare Workers AI REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)
- [Cloudflare Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Cloudflare model card: FLUX.2 [klein] 4B](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/)