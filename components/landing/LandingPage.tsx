import type { Post, Project } from "@prisma/client";
import HeroSection from "./HeroSection";
import WelcomeSection from "./WelcomeSection";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import JourneySection from "./JourneySection";
import PhilosophySection from "./PhilosophySection";
import JournalSection from "./JournalSection";
import CTASection from "./CTASection";

type LandingPageProps = {
  projects: Project[];
  posts: Post[];
};

export default function LandingPage({ projects, posts }: LandingPageProps) {
  return (
    <main>
      <HeroSection />
      <JourneySection />
      <WelcomeSection />
      <PhilosophySection />
      <FeaturedProjectsSection projects={projects} />
      <JournalSection posts={posts} />
      <CTASection />
    </main>
  );
}
