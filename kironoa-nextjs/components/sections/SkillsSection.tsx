export default function SkillsSection() {
  const categories = [
    {
      label: 'Frontend',
      skills: ['HTML5', 'CSS3', 'JavaScript', '.NET MAUI', 'ASP.NET'],
    },
    {
      label: 'Backend',
      skills: ['Supabase', 'SQLite'],
    },
    {
      label: 'Design & Tools',
      skills: ['Figma', 'Gemini'],
    },
  ]

  return (
    <section id="skills-section">
      <h2 className="section-title">Technical Arsenal</h2>
      <div className="skills-grid">
        {categories.map(cat => (
          <div key={cat.label} className="skill-category">
            <span className="tag">{cat.label}</span>
            <div className="skill-list">
              {cat.skills.map(s => (
                <div key={s} className="skill-item">{s}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
