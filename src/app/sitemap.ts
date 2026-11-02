import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes, siteConfig } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let courseEntries: MetadataRoute.Sitemap = [];
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    courseEntries = courses.map((c) => ({
      url: absoluteUrl(`/courses#${c.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    courseEntries = [];
  }

  return [
    ...staticEntries,
    ...courseEntries,
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
