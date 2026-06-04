import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { LanguageProvider } from './i18n.jsx';
import { FilterProvider } from './filters.jsx';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import WorkPage from './pages/WorkPage.jsx';
import FootnotePreview from './components/FootnotePreview.jsx';
import './index.css';

function LegacyWorkRedirect() {
  const params = useParams();
  const location = useLocation();
  return (
    <Navigate
      to={{
        pathname: `/${params['*'] || ''}`,
        hash: location.hash,
      }}
      state={location.state}
      replace
    />
  );
}

// HashRouter keeps client-side routing working on GitHub Pages
// (no server rewrites required).
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <FilterProvider>
        <FootnotePreview />
        <HashRouter>
          <Routes>
            <Route element={<App />}>
              <Route index element={<Home />} />
              {/* Back-compat for old #/artwork/* bookmarks. */}
              <Route path="artwork/*" element={<LegacyWorkRedirect />} />
              <Route path="*" element={<WorkPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </FilterProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
