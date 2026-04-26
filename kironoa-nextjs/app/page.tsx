import { ThemeProvider }    from '@/hooks/useTheme'
import TopNav              from '@/components/layout/TopNav'
import FloatingNav         from '@/components/layout/FloatingNav'
import BentoSection        from '@/components/sections/BentoSection'
import SkillsSection       from '@/components/sections/SkillsSection'
import CertificatesSection from '@/components/sections/CertificatesSection'
import ProjectsSection     from '@/components/sections/ProjectsSection'
import CursorInit          from '@/components/ui/CursorInit'

export default function Home() {
  return (
    <ThemeProvider>
      {/* Custom cursor dot */}
      <div className="cursor-follower" />
      <CursorInit />

      {/* Fixed UI chrome */}
      <TopNav />
      <FloatingNav />

      {/* Scrollable sections */}
      <BentoSection />
      <SkillsSection />
      <CertificatesSection />
      <ProjectsSection />
    </ThemeProvider>
  )
}
