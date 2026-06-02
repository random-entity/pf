import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import DatabaseBrowser from './DatabaseBrowser.jsx'
import LangSwitch from './LangSwitch.jsx'

// Navigation panel: a single searchable database of all artworks.
export default function Sidebar() {
  const { t } = useLang()
  return (
    <nav>
      <div className="sidebar-header">
        <Link className="sidebar-title" to="/">{t('siteTitle')}</Link>
        <LangSwitch />
      </div>
      <DatabaseBrowser />
    </nav>
  )
}
