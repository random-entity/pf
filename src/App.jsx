import { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLang } from './i18n.jsx';
import Sidebar from './components/Sidebar.jsx';

const MIN_W = 200;
const MAX_W = 520;

export default function App() {
  const { t } = useLang();
  const [pageTitle, setPageTitle] = useState('');
  // A topbar slot that WorkPage portals its rich title into (so the title can
  // carry footnote superscripts rendered/numbered by WorkPage's own subtree).
  const [titleSlot, setTitleSlot] = useState(null);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(() => {
    const saved = Number(localStorage.getItem('sidebarWidth'));
    return saved >= MIN_W && saved <= MAX_W ? saved : 280;
  });
  const layoutRef = useRef(null);
  const widthRef = useRef(width);

  function startResize(e) {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    const left = layoutRef.current.getBoundingClientRect().left;
    const onMove = (ev) => {
      const w = Math.min(MAX_W, Math.max(MIN_W, Math.round(ev.clientX - left)));
      widthRef.current = w;
      setWidth(w);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      localStorage.setItem('sidebarWidth', String(widthRef.current));
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return (
    <div
      className="layout"
      ref={layoutRef}
      style={{ '--sidebar': `${width}px` }}
    >
      <aside className={`sidebar ${open ? '' : 'collapsed'}`}>
        <Sidebar />
      </aside>
      <div
        className="resizer"
        onMouseDown={startResize}
        role="separator"
        aria-orientation="vertical"
        aria-label={t('resize')}
      />

      <main className="content">
        <div className="topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <button
                className="menu-toggle"
                onClick={() => setOpen((v) => !v)}
                aria-label={t('menu')}
              >
                Menu
              </button>
            </div>
            <div className="topbar-page-title">
              {pageTitle}
              <span ref={setTitleSlot} />
            </div>
          </div>
        </div>
        <div className="content-inner">
          <Outlet context={{ setPageTitle, titleSlot }} />
        </div>
      </main>
    </div>
  );
}
