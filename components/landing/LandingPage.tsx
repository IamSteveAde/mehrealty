import type { Post, Project } from "@prisma/client";
import HeroSection from "./HeroSection";
import WelcomeSection from "./WelcomeSection";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import JourneySection from "./JourneySection";
import JournalSection from "./JournalSection";
import CTASection from "./CTASection";

type LandingPageProps = {
  projects: Project[];
  posts: Post[];
};

export default function LandingPage({ projects }: LandingPageProps) {
  return (
    <main>
      <div className="relative isolate">
        <HeroSection />
        <WelcomeSection />
      </div>
      <JourneySection />
      <FeaturedProjectsSection projects={projects} />
      <JournalSection />
      <CTASection />
    </main>
  );
}
