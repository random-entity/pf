import DatabaseBrowser from './DatabaseBrowser.jsx'

// Navigation panel: a single searchable database of all artworks.
export default function Sidebar() {
  return (
    <nav>
      <DatabaseBrowser />
    </nav>
  )
}
