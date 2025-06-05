import HeroSection from '@/components/HeroSection'
import FeatureGrid from '@/components/FeatureGrid'
import WorkflowSection from '@/components/WorkflowSection'
import NoSkillsSection from '@/components/NoSkillsSection'
import LivestreamSection from '@/components/LivestreamSection'
import DashboardPreview from '@/components/DashboardPreview'
import BuyerExperience from '@/components/BuyerExperience'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <NoSkillsSection />
      <LivestreamSection />
      <DashboardPreview />
      <BuyerExperience />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}