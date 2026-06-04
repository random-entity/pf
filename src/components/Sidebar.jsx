import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import DatabaseBrowser from './DatabaseBrowser.jsx'
import LangSwitch from './LangSwitch.jsx'

// Navigation panel: a single searchable database of all works.
export default function Sidebar() {
  const { t } = useLang()
  return (
    <nav>
      <div className="sidebar-topbar">
        <Link className="sidebar-site-title" to="/" lang="ko">{t('siteTitle')}</Link>
        <LangSwitch />
      </div>
      <DatabaseBrowser />
    </nav>
  )
}
