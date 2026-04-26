'use client'

import { useRef, useState } from 'react'

export default function ContactCard() {
  const [nickname, setNickname] = useState('')
  const [message, setMessage]   = useState('')
  const [success, setSuccess]   = useState(false)
  const [sending, setSending]   = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles]       = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)

    // TODO: Wire up to Supabase or an email service
    // For now, simulate a brief delay
    await new Promise(r => setTimeout(r, 800))

    setSending(false)
    setSuccess(true)
    setNickname('')
    setMessage('')
    setFiles([])
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files))
  }

  return (
    <div className="card contact-card">
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>Send Noodles 🍜</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="text"
          placeholder="Your nickname..."
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          style={inputStyle}
        />

        {/* File previews */}
        {files.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {files.map((f, i) => (
              <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 8 }}>
                {f.name}
              </span>
            ))}
          </div>
        )}

        <div className="messageBox">
          {/* File upload */}
          <div className="fileUploadWrapper">
            <label htmlFor="portfolio-file-upload" aria-label="Attach files">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                <circle strokeWidth="20" stroke="currentColor" fill="none" r="158.5" cy="168.5" cx="168.5" />
                <path strokeLinecap="round" strokeWidth="25" stroke="currentColor" d="M167.759 79V259" />
                <path strokeLinecap="round" strokeWidth="25" stroke="currentColor" d="M79 167.138H259" />
              </svg>
              <input type="file" id="portfolio-file-upload" multiple hidden ref={fileRef} onChange={handleFiles} />
            </label>
          </div>

          <textarea
            placeholder="Message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={1}
            required
          />

          <button type="submit" className="send-icon-btn" disabled={sending} aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="currentColor" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
            </svg>
          </button>
        </div>
      </form>

      {success && (
        <div className="glass-alert show" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: 8, textAlign: 'center' }}>
          ✨ Message sent successfully!
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  padding: '10px 14px',
  color: 'var(--text-main)',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
}
