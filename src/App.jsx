import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useLang } from './i18n.jsx'
import Sidebar from './components/Sidebar.jsx'
import LangSwitch from './components/LangSwitch.jsx'

export default function App() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <div className="layout">
      <aside className={`sidebar ${open ? '' : 'collapsed'}`}>
        <Sidebar />
      </aside>

      <main className="content">
        <div className="content-inner">
          <div className="topbar">
            <h1>
              <button
                className="menu-toggle"
                onClick={() => setOpen((v) => !v)}
                aria-label={t('menu')}
              >
                ☰
              </button>{' '}
              <Link to="/">{t('siteTitle')}</Link>
            </h1>
            <LangSwitch />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
