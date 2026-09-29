import { db } from "@/lib/db";
import LandingPage from "@/components/landing/LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, posts] = await Promise.all([
    db.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  return <LandingPage projects={projects} posts={posts} />;
}