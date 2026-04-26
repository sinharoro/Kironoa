export default function CertificatesSection() {
  return (
    <section id="certificates-section">
      <h2 className="section-title" style={{ fontFamily: "'Playfair Display', serif" }}>Verified Achievements</h2>
      <div className="cert-bento-grid">
        <div className="cert-card wide">
          <div className="cert-content">
            <span className="tag">Technical</span>
            <h3>Newbie pa ngani...</h3>
            <p>Issued by Google • 2024</p>
          </div>
          <div className="cert-preview">
            <div style={{ width: '100%', height: 120, background: 'var(--surface)', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
              📜
            </div>
          </div>
        </div>

        <div className="cert-card small">
          <div className="cert-content">
            <span className="tag">Design</span>
            <h3>UI/UX Mastery</h3>
            <p>Coursera</p>
          </div>
        </div>
      </div>
    </section>
  )
}