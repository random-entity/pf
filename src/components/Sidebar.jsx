import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import TreeBrowser from './TreeBrowser.jsx'
import DatabaseBrowser from './DatabaseBrowser.jsx'

// Navigation panel with two interchangeable modes: a file-browser tree and
// a searchable database.
export default function Sidebar() {
  const { t } = useLang()
  const [mode, setMode] = useState('files') // 'files' | 'database'

  return (
    <nav>
      <div className="tabs">
        <button aria-pressed={mode === 'files'} onClick={() => setMode('files')}>
          {t('files')}
        </button>
        <button aria-pressed={mode === 'database'} onClick={() => setMode('database')}>
          {t('database')}
        </button>
      </div>
      {mode === 'files' ? <TreeBrowser /> : <DatabaseBrowser />}
    </nav>
  )
}
