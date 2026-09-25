import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import GarmentDetailPage from './pages/GarmentDetailPage';
import RemixStudioPage from './pages/RemixStudioPage';
import ResultPage from './pages/ResultPage';
import LookbookPage from './pages/LookbookPage';
import CulturePage from './pages/CulturePage';
import SourcesPage from './pages/SourcesPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        {/* Skip to main content — accessibility §55 */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
          onFocus={(e) => {
            const el = e.currentTarget;
            el.style.left = '16px';
            el.style.top = '16px';
            el.style.width = 'auto';
            el.style.height = 'auto';
            el.style.overflow = 'visible';
            el.style.zIndex = '9999';
            el.style.background = 'var(--color-ink)';
            el.style.color = 'var(--color-white)';
            el.style.padding = '8px 16px';
            el.style.borderRadius = '4px';
          }}
          onBlur={(e) => {
            const el = e.currentTarget;
            el.style.left = '-9999px';
            el.style.width = '1px';
            el.style.height = '1px';
          }}
        >
          Nhảy đến nội dung chính
        </a>
        <ScrollToTop />
        <Navigation />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/garments" element={<ExplorePage />} />
            <Route path="/garments/:id" element={<GarmentDetailPage />} />
            <Route path="/remix" element={<RemixStudioPage />} />
            <Route path="/studio" element={<RemixStudioPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/card/:outfitId" element={<ResultPage />} />
            <Route path="/card" element={<ResultPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/culture" element={<CulturePage />} />
            <Route path="/about" element={<CulturePage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/gallery" element={<ExplorePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;
