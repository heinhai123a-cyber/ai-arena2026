import { useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, LoaderCircle, RefreshCw, Sparkles, X } from 'lucide-react';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { HeritageOrnament } from '../components/heritage/HeritageOrnament';
import { HeritagePattern } from '../components/heritage/HeritagePattern';
import { LotusLogo } from '../components/LotusLogo';
import './AiTryOnPage.css';

const maxFileSize = 8 * 1024 * 1024;
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
type ApiStatus = 'checking' | 'ready' | 'missing-key' | 'offline';

const promptIdeas = [
  'Áo dài lụa màu đỏ son, nền phố cổ Hội An lúc chiều muộn',
  'Áo tứ thân màu trầm, khăn mỏ quạ, không gian lễ hội Bắc Bộ',
  'Áo bà ba màu xanh ngọc, khung cảnh miệt vườn Nam Bộ',
];

function imageDataToBlob(data: string, mimeType: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function AiTryOnPage() {
  useDocumentTitle('Thử Đồ AI — Việt Phục Remix');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoUrlRef = useRef('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '9:16'>('4:5');
  const [consent, setConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [providerDiagnostic, setProviderDiagnostic] = useState('');
  const [errorKind, setErrorKind] = useState('');
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

  useEffect(() => () => {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
  }, []);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then(response => {
        if (!response.ok) throw new Error('API health check failed');
        return response.json();
      })
      .then(data => {
        if (!cancelled) setApiStatus(data.configured ? 'ready' : 'missing-key');
      })
      .catch(() => {
        if (!cancelled) setApiStatus('offline');
      });
    return () => { cancelled = true; };
  }, []);

  const handlePhotoChange = (file?: File) => {
    setError('');
    setResultUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });
    if (!file) {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      photoUrlRef.current = '';
      setPhotoUrl('');
      setPhoto(null);
      return;
    }
    if (!supportedTypes.has(file.type)) {
      setError('Ảnh cần ở định dạng JPG, PNG hoặc WebP.');
      return;
    }
    if (file.size > maxFileSize) {
      setError('Ảnh vượt quá 8 MB. Hãy chọn ảnh nhỏ hơn.');
      return;
    }
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = URL.createObjectURL(file);
    setPhotoUrl(photoUrlRef.current);
    setPhoto(file);
  };

  const generateTryOn = async () => {
    if (!photo || !consent || isGenerating) return;
    setIsGenerating(true);
    setError('');
    setProviderDiagnostic('');
    setErrorKind('');
    setResultUrl(current => {
      if (current) URL.revokeObjectURL(current);
      return '';
    });

    const formData = new FormData();
    formData.set('photo', photo);
    formData.set('prompt', prompt.trim());
    formData.set('aspectRatio', aspectRatio);
    formData.set('consent', 'true');

    try {
      const response = await fetch('/api/try-on', { method: 'POST', body: formData });
      const payload = await response.json();
      if (!response.ok) {
        setProviderDiagnostic(payload.providerMessage || 'Cloudflare không trả thêm mã chi tiết.');
        setErrorKind(payload.errorKind || '');
        throw new Error(payload.error || 'Không tạo được ảnh. Hãy thử lại sau.');
      }
      if (typeof payload.imageData !== 'string' || !payload.imageData) {
        throw new Error('Model không trả về ảnh. Hãy thử một prompt khác.');
      }
      const output = imageDataToBlob(payload.imageData, payload.mimeType || 'image/jpeg');
      setResultUrl(URL.createObjectURL(output));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Có lỗi kết nối. Hãy thử lại sau.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-try-on-page">
      {/* ═══ IMPERIAL BANNER ═══ */}
      <div className="ai-try-on-banner">
        <div className="bg-overlay">
          <img
            src="/images/heritage/royal-dragon-phoenix-bg.jpg"
            alt=""
            aria-hidden="true"
          />
          <div className="gradient" />
        </div>

        <HeritagePattern opacity={0.04} />
        <HeritageOrnament variant="corner" size={48} style={{ position: 'absolute', top: 6, left: 6, zIndex: 3 }} />
        <HeritageOrnament variant="corner" size={48} style={{ position: 'absolute', top: 6, right: 6, zIndex: 3, transform: 'rotate(90deg)' }} />
        <HeritageOrnament variant="corner" size={48} style={{ position: 'absolute', bottom: 6, left: 6, zIndex: 3, transform: 'rotate(-90deg)' }} />
        <HeritageOrnament variant="corner" size={48} style={{ position: 'absolute', bottom: 6, right: 6, zIndex: 3, transform: 'rotate(180deg)' }} />

        <div className="ai-try-on-banner-inner">
          <header className="ai-try-on-heading">
            <span className="ai-try-on-kicker"><Sparkles size={15} /> ✦ PHÒNG THỬ XIÊM Y HOÀNG CUNG ✦</span>
            <h1>Thử một bản phối lên chính bạn</h1>
            <p>Tải ảnh chân dung, mô tả bộ xiêm y bạn muốn khoác lên và chiêm ngưỡng bản phối minh họa từ FLUX.2 [klein] trên Cloudflare Workers AI.</p>
          </header>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="ai-try-on-shell">
        <div className="ai-try-on-grid">
          {/* ── LEFT: Controls Panel ── */}
          <section className="ai-try-on-controls" aria-label="Thiết lập bản phối">

            {/* Photo Upload */}
            <div className="ai-try-on-field">
              <label className="ai-try-on-label" htmlFor="try-on-photo">
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: 800,
                }}>1</span>
                Ảnh của bạn
              </label>
              {photoUrl ? (
                <div className="ai-try-on-uploaded">
                  <img src={photoUrl} alt="Ảnh đã chọn để thử trang phục" />
                  <button type="button" className="ai-try-on-remove" onClick={() => handlePhotoChange()} aria-label="Xóa ảnh đã chọn">
                    <X size={15} />
                  </button>
                  <div>
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: 'var(--color-crimson)',
                      display: 'block', marginBottom: 2,
                    }}>
                      ✓ Ảnh đã sẵn sàng
                    </span>
                    <span>{photo?.name}</span>
                  </div>
                </div>
              ) : (
                <button type="button" className="ai-try-on-dropzone" onClick={() => fileInputRef.current?.click()}>
                  <div className="drop-icon">
                    <ImagePlus size={24} />
                  </div>
                  <strong>Chọn ảnh chân dung</strong>
                  <span>JPG, PNG hoặc WebP · tối đa 8 MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                id="try-on-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="ai-try-on-visually-hidden"
                onChange={event => handlePhotoChange(event.currentTarget.files?.[0])}
              />
            </div>

            {/* Prompt / Description */}
            <div className="ai-try-on-field">
              <label className="ai-try-on-label" htmlFor="try-on-prompt">
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: 800,
                }}>2</span>
                Mô tả bản phối
              </label>
              <textarea
                id="try-on-prompt"
                value={prompt}
                maxLength={700}
                rows={4}
                placeholder="Ví dụ: Áo dài lụa màu xanh ngọc, nền vườn cây miền Tây..."
                onChange={event => setPrompt(event.currentTarget.value)}
              />
              <div className="ai-try-on-char-count">{prompt.length}/700</div>

              {/* Prompt suggestions */}
              <div className="ai-try-on-suggestions" aria-label="Gợi ý prompt">
                {promptIdeas.map(idea => (
                  <button key={idea} type="button" onClick={() => setPrompt(idea)}>
                    ✦ {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Ornamental Divider */}
            <div className="ai-try-on-section-divider">
              <span className="ornament">✦ ❖ ✦</span>
            </div>

            {/* Aspect Ratio */}
            <fieldset className="ai-try-on-field ai-try-on-ratios">
              <legend className="ai-try-on-label">
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: 800,
                }}>3</span>
                Tỷ lệ ảnh
              </legend>
              {(['4:5', '9:16'] as const).map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  className={aspectRatio === ratio ? 'selected' : ''}
                  aria-pressed={aspectRatio === ratio}
                  onClick={() => setAspectRatio(ratio)}
                >
                  {ratio}
                </button>
              ))}
            </fieldset>

            {/* Consent */}
            <label className="ai-try-on-consent">
              <input type="checkbox" checked={consent} onChange={event => setConsent(event.currentTarget.checked)} />
              <span>Tôi có quyền sử dụng ảnh và đồng ý gửi ảnh cùng prompt đến Cloudflare Workers AI để tạo bản phối. Người trong ảnh đã đồng ý; nếu là trẻ vị thành niên, tôi có sự đồng ý của người giám hộ.</span>
            </label>

            {/* Privacy notices */}
            <p className="ai-try-on-privacy">
              Ứng dụng không lưu ảnh. Ảnh và prompt được gửi đến Cloudflare Workers AI để xử lý; xem <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">chính sách quyền riêng tư Cloudflare</a> và <a href="https://bfl.ai/legal/terms-of-service" target="_blank" rel="noreferrer">điều khoản model FLUX</a>. Kết quả có thể không giữ khuôn mặt/chất liệu chính xác tuyệt đối.
            </p>
            <p className="ai-try-on-privacy">
              Workers AI có free allocation 10,000 neurons/ngày. App giới hạn 10 lượt/ngày trên mỗi IP khi server đang chạy; bộ đếm reset nếu restart server. Hãy giữ tài khoản ở Workers Free: nếu đang dùng Workers Paid, phần dùng vượt free allocation có thể bị tính phí. Xem <a href="https://developers.cloudflare.com/workers-ai/platform/pricing/" target="_blank" rel="noreferrer">bảng giá và hạn mức</a>.
            </p>

            {/* API status notices */}
            {apiStatus === 'missing-key' && <p className="ai-try-on-notice" role="status">Backend đang chạy; hãy cấu hình CLOUDFLARE_ACCOUNT_ID và CLOUDFLARE_API_TOKEN trong file .env.</p>}
            {apiStatus === 'offline' && <p className="ai-try-on-notice" role="status">Chưa kết nối được backend. Hãy chạy npm run dev từ thư mục project.</p>}
            {error && <p className="ai-try-on-error" role="alert">{error}</p>}
            {providerDiagnostic && (
              <details className="ai-try-on-diagnostic">
                <summary>Chi tiết lỗi từ Cloudflare Workers AI</summary>
                <p>{providerDiagnostic}</p>
                <a
                  href="https://dash.cloudflare.com/?to=/:account/ai/workers-ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  {errorKind === 'cloudflare-daily-limit' ? 'Kiểm tra quota Workers AI' : 'Mở Cloudflare Workers AI'}
                </a>
              </details>
            )}

            {/* Submit */}
            <button
              type="button"
              className="ai-try-on-submit"
              disabled={!photo || !consent || prompt.trim().length < 8 || isGenerating || apiStatus !== 'ready'}
              onClick={generateTryOn}
            >
              {isGenerating ? <LoaderCircle size={18} className="ai-try-on-spinner" /> : <Sparkles size={18} />}
              {isGenerating ? 'Đang dệt phục trang...' : '✦ Tạo bản phối'}
            </button>
          </section>

          {/* ── RIGHT: Result Panel (Gương Đồng) ── */}
          <section className="ai-try-on-result" aria-live="polite" aria-label="Kết quả thử trang phục">
            {/* Result Header Bar */}
            <div className="ai-try-on-result-header">
              <div className="title-group">
                <LotusLogo size={16} />
                <span className="title-text">Gương Đồng Kết Quả</span>
              </div>
              <span className={`status-badge ${resultUrl ? 'ready' : 'waiting'}`}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: resultUrl ? '#2E7D32' : 'var(--color-gold-dark)',
                  display: 'inline-block',
                }} />
                {resultUrl ? 'Đã hiển thị' : isGenerating ? 'Đang xử lý' : 'Chờ tạo phối'}
              </span>
            </div>

            {resultUrl ? (
              <>
                <img className="ai-try-on-result-image" src={resultUrl} alt="Bản phối Việt phục do FLUX.2 Klein tạo từ ảnh bạn tải lên" />
                <div className="ai-try-on-result-actions">
                  <a href={resultUrl} download="viet-phuc-remix.jpg"><Download size={17} /> Tải ảnh</a>
                  <button type="button" onClick={() => { setResultUrl(current => { if (current) URL.revokeObjectURL(current); return ''; }); }}>
                    <RefreshCw size={16} /> Thử prompt khác
                  </button>
                </div>
                <p className="ai-try-on-result-note">Ảnh được tạo bởi FLUX.2 [klein] (Cloudflare Workers AI), có thể khác ảnh gốc và không phải ảnh tư liệu trang phục lịch sử.</p>
              </>
            ) : (
              <div className="ai-try-on-empty">
                {isGenerating ? (
                  <div className="generating-state">
                    <div className="ai-try-on-generating-ring">
                      <div className="ring-outer" />
                      <div className="ring-center">
                        <LotusLogo size={24} />
                      </div>
                    </div>
                    <strong>Đang dệt phục trang...</strong>
                    <span>FLUX.2 [klein] đang chỉnh trang phục theo ảnh và mô tả của bạn.</span>
                  </div>
                ) : (
                  <>
                    <div className="ai-try-on-empty-icon"><ImagePlus size={28} /></div>
                    <strong>Bản phối sẽ hiện ở đây</strong>
                    <span>Chọn ảnh, thêm mô tả và xác nhận quyền sử dụng ảnh để bắt đầu.</span>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AiTryOnPage;