import { useLang, LANGS, LANG_LABELS } from '../i18n.jsx'

// Always-visible language selector (lives in the top bar).
export default function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="langswitch" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
