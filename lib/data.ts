import "server-only";

import type { Certification, Profile, Project } from "@prisma/client";
import { prisma } from "@/lib/db";

const fallbackProfile: Profile = {
  id: "main",
  name: "Your Name",
  title: "Software Engineer",
  shortBio:
    "I build thoughtful digital products — clean interfaces, reliable systems, and details that make people feel at home.",
  biography:
    "Add your biography from the admin dashboard at /admin/profile.",
  photoUrl: "/images/profile.svg",
  location: "Indonesia",
  email: "hello@example.com",
  githubUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  availability: "Open to select work",
  updatedAt: new Date(),
};

export async function getProfile(): Promise<Profile> {
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  return profile ?? fallbackProfile;
}

export async function getPublishedProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedProjects(limit = 2): Promise<Project[]> {
  return prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return prisma.project.findFirst({ where: { slug, published: true } });
}

export async function getPublishedCertifications(): Promise<Certification[]> {
  return prisma.certification.findMany({
    where: { published: true },
    orderBy: [{ displayOrder: "asc" }, { issueDate: "desc" }],
  });
}

export async function getFeaturedCertifications(
  limit = 3,
): Promise<Certification[]> {
  return prisma.certification.findMany({
    where: { published: true, featured: true },
    orderBy: [{ displayOrder: "asc" }, { issueDate: "desc" }],
    take: limit,
  });
}

export function splitTechnologies(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
