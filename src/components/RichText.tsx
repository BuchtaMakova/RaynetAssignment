import DOMPurify from 'dompurify'
import { useMemo } from 'react'

// odkazy z poznámek do nové záložky + noopener, ať nemají přístup k window.opener
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

// Poznámky z Raynetu jsou HTML, takže je před vložením čistím přes DOMPurify (jinak XSS).
export function RichText({ html, className = '' }: { html: string; className?: string }) {
  const clean = useMemo(() => DOMPurify.sanitize(html), [html])
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />
}
