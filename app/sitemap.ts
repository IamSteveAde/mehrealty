
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const now = new Date();

  // Main website pages
  const pages: MetadataRoute.Sitemap = [
    "",
    "/developments",
    "/services",
    "/about",
    "/journal",
    "/media",
    "/contact",
  ].map((path) => ({
    url: `${origin}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    // Published developments and journal posts
    const [projects, posts] = await Promise.all([
      db.project.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      db.post.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${origin}/developments/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly",
      priority: 0.9,
    }));

    const journalPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${origin}/journal/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...pages, ...projectPages, ...journalPages];
  } catch (error) {
    console.error("Sitemap database query failed:", error);

    // Keep the demo sitemap available even without database tables
    return pages;
  }
}
