"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";
import type { FormState } from "@/lib/types";

/* ---------------------------------- helpers --------------------------------- */

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function toDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function collectValues(formData: FormData, excluded: string[] = []) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (excluded.includes(key) || key.startsWith("$")) continue;
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

function refreshSite() {
  revalidatePath("/");
  revalidatePath("/certifications");
  revalidatePath("/portfolio");
  revalidatePath("/contact");
}

/* -------------------------------- session ---------------------------------- */

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

/* --------------------------------- profile --------------------------------- */

export async function updateProfile(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const name = text(formData, "name");
  const title = text(formData, "title");
  const shortBio = text(formData, "shortBio");
  const biography = text(formData, "biography");
  const photoUrl = text(formData, "photoUrl");
  const location = text(formData, "location");
  const email = text(formData, "email");
  const availability = text(formData, "availability");
  const githubUrl = text(formData, "githubUrl");
  const linkedinUrl = text(formData, "linkedinUrl");
  const instagramUrl = text(formData, "instagramUrl");

  if (!name || !title || !shortBio || !biography) {
    return {
      error: "Name, title, short introduction and biography are required.",
      values: collectValues(formData),
    };
  }
  if (!photoUrl || !location || !availability) {
    return {
      error: "Photo URL, location and availability are required.",
      values: collectValues(formData),
    };
  }
  if (!isEmail(email)) {
    return {
      error: "Please enter a valid email address.",
      values: collectValues(formData),
    };
  }
  if (shortBio.length > 400) {
    return {
      error: "The short introduction must be under 400 characters.",
      values: collectValues(formData),
    };
  }

  const data = {
    name,
    title,
    shortBio,
    biography,
    photoUrl,
    location,
    email,
    availability,
    githubUrl: githubUrl || null,
    linkedinUrl: linkedinUrl || null,
    instagramUrl: instagramUrl || null,
  };

  await prisma.profile.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  refreshSite();
  revalidatePath("/admin/profile");

  return { success: true, message: "Profile updated." };
}

/* ------------------------------ certifications ----------------------------- */

type CertificationInput = {
  title: string;
  issuer: string;
  issueDate: Date;
  expirationDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string;
  imageUrl: string | null;
  displayOrder: number;
  featured: boolean;
  published: boolean;
};

function parseCertification(
  formData: FormData,
):
  | { ok: false; error: string }
  | { ok: true; data: CertificationInput } {
  const title = text(formData, "title");
  const issuer = text(formData, "issuer");
  const description = text(formData, "description");
  const issueDate = toDate(text(formData, "issueDate"));
  const expirationDate = toDate(text(formData, "expirationDate"));
  const displayOrder = Number(text(formData, "displayOrder") || "0");

  if (!title) return { ok: false, error: "Certification title is required." };
  if (!issuer) return { ok: false, error: "Issuing organization is required." };
  if (!description) return { ok: false, error: "Description is required." };
  if (!issueDate) return { ok: false, error: "A valid issue date is required." };

  return {
    ok: true,
    data: {
      title,
      issuer,
      description,
      issueDate,
      expirationDate,
      credentialId: text(formData, "credentialId") || null,
      credentialUrl: text(formData, "credentialUrl") || null,
      imageUrl: text(formData, "imageUrl") || null,
      displayOrder: Number.isFinite(displayOrder) ? Math.trunc(displayOrder) : 0,
      featured: checkbox(formData, "featured"),
      published: checkbox(formData, "published"),
    },
  };
}

export async function createCertification(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const result = parseCertification(formData);
  if (!result.ok)
    return { error: result.error, values: collectValues(formData) };

  await prisma.certification.create({ data: result.data });

  refreshSite();
  revalidatePath("/admin/certifications");
  redirect("/admin/certifications");
}

export async function updateCertification(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = text(formData, "id");
  if (!id) return { error: "Missing certification id." };

  const result = parseCertification(formData);
  if (!result.ok)
    return { error: result.error, values: collectValues(formData, ["id"]) };

  await prisma.certification.update({ where: { id }, data: result.data });

  refreshSite();
  revalidatePath("/admin/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertification(formData: FormData) {
  await requireSession();

  const id = text(formData, "id");
  if (id) {
    await prisma.certification.delete({ where: { id } }).catch(() => null);
  }

  refreshSite();
  revalidatePath("/admin/certifications");
  redirect("/admin/certifications");
}

/* --------------------------------- projects -------------------------------- */

type ProjectInput = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  technologies: string;
  liveUrl: string | null;
  githubUrl: string | null;
  year: string;
  role: string;
  displayOrder: number;
  featured: boolean;
  published: boolean;
};

function parseProject(
  formData: FormData,
):
  | { ok: false; error: string }
  | { ok: true; data: ProjectInput } {
  const title = text(formData, "title");
  const slugInput = text(formData, "slug");
  const shortDescription = text(formData, "shortDescription");
  const description = text(formData, "description");
  const imageUrl = text(formData, "imageUrl");
  const year = text(formData, "year");
  const role = text(formData, "role");
  const displayOrder = Number(text(formData, "displayOrder") || "0");

  if (!title) return { ok: false, error: "Project title is required." };
  if (!shortDescription)
    return { ok: false, error: "Short description is required." };
  if (!description) return { ok: false, error: "Full description is required." };
  if (!imageUrl) return { ok: false, error: "Cover image URL is required." };
  if (!year) return { ok: false, error: "Year is required." };
  if (!role) return { ok: false, error: "Role is required." };

  const slug = slugify(slugInput || title);
  if (!slug) return { ok: false, error: "Please provide a valid slug." };

  return {
    ok: true,
    data: {
      title,
      slug,
      shortDescription,
      description,
      imageUrl,
      year,
      role,
      technologies: text(formData, "technologies"),
      liveUrl: text(formData, "liveUrl") || null,
      githubUrl: text(formData, "githubUrl") || null,
      displayOrder: Number.isFinite(displayOrder) ? Math.trunc(displayOrder) : 0,
      featured: checkbox(formData, "featured"),
      published: checkbox(formData, "published"),
    },
  };
}

export async function createProject(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const result = parseProject(formData);
  if (!result.ok)
    return { error: result.error, values: collectValues(formData, ["id"]) };

  const existing = await prisma.project.findUnique({
    where: { slug: result.data.slug },
  });
  if (existing) {
    return {
      error: "That slug is already used by another project.",
      values: collectValues(formData, ["id"]),
    };
  }

  await prisma.project.create({ data: result.data });

  refreshSite();
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function updateProject(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = text(formData, "id");
  if (!id) return { error: "Missing project id." };

  const result = parseProject(formData);
  if (!result.ok)
    return { error: result.error, values: collectValues(formData, ["id"]) };

  const existing = await prisma.project.findUnique({
    where: { slug: result.data.slug },
  });
  if (existing && existing.id !== id) {
    return {
      error: "That slug is already used by another project.",
      values: collectValues(formData, ["id"]),
    };
  }

  await prisma.project.update({ where: { id }, data: result.data });

  refreshSite();
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deleteProject(formData: FormData) {
  await requireSession();

  const id = text(formData, "id");
  if (id) {
    await prisma.project.delete({ where: { id } }).catch(() => null);
  }

  refreshSite();
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

/* --------------------------------- messages -------------------------------- */

export async function setMessageRead(formData: FormData) {
  await requireSession();

  const id = text(formData, "id");
  const read = text(formData, "read") === "true";

  if (id) {
    await prisma.message
      .update({ where: { id }, data: { read } })
      .catch(() => null);
  }

  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireSession();

  const id = text(formData, "id");
  if (id) {
    await prisma.message.delete({ where: { id } }).catch(() => null);
  }

  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}
