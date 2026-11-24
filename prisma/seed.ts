import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: await bcrypt.hash(adminPassword, 10) },
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await prisma.profile.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "Your Name",
      title: "Software Engineer & Digital Craftsman",
      shortBio:
        "I build thoughtful digital products — clean interfaces, reliable systems, and details that make people feel at home.",
      biography:
        "I'm a software engineer based in Indonesia. My work sits between engineering and design: I care about how things are built, and just as much about how they feel to use.\n\nOver the past few years I've shipped web applications, internal tools, and small products for teams of every size. I enjoy the quiet parts of the craft — readable code, honest copy, sensible defaults.\n\nWhen I'm not at a keyboard, I'm usually reading, collecting fonts, or documenting something I'll forget otherwise.",
      photoUrl: "/images/profile.svg",
      location: "Jakarta, Indonesia",
      email: "hello@example.com",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      instagramUrl: "",
      availability: "Open to select freelance work",
    },
  });

  const certifications = [
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: new Date("2024-05-18"),
      expirationDate: new Date("2027-05-18"),
      credentialId: "AWS-SAA-000000",
      credentialUrl: "https://aws.amazon.com/certification/",
      description:
        "Validated ability to design resilient, secure, and cost-aware architectures on AWS.",
      imageUrl: "/images/cert-1.svg",
      displayOrder: 1,
      featured: true,
    },
    {
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta",
      issueDate: new Date("2023-09-02"),
      expirationDate: null,
      credentialId: "META-FE-000000",
      credentialUrl: "https://coursera.org/professional-certificates/meta-front-end-developer",
      description:
        "Nine-course program covering React, responsive design, version control, and UX fundamentals.",
      imageUrl: "/images/cert-2.svg",
      displayOrder: 2,
      featured: true,
    },
    {
      title: "Google Data Analytics Certificate",
      issuer: "Google",
      issueDate: new Date("2022-11-14"),
      expirationDate: null,
      credentialId: "",
      credentialUrl: "https://grow.google/certificates/data-analytics/",
      description:
        "Foundations of data cleaning, analysis, visualization, and communicating insights.",
      imageUrl: "/images/cert-3.svg",
      displayOrder: 3,
      featured: false,
    },
  ];

  if ((await prisma.certification.count()) === 0) {
    for (const certification of certifications) {
      await prisma.certification.create({ data: certification });
    }
  }

  const projects = [
    {
      title: "Ledger",
      slug: "ledger",
      shortDescription:
        "A calm personal finance dashboard that turns messy statements into a clear monthly picture.",
      description:
        "Ledger is a personal finance workspace built for people who want to understand their money without a spreadsheet.\n\nIt imports bank statements, categorises transactions with a small rule engine, and presents a monthly view that takes seconds to read. The interface is intentionally quiet: one number per month, one list per category, no gamification.\n\nBuilt with Next.js, PostgreSQL, and Tailwind CSS. The rule engine runs on the server so the client stays fast on low-end devices.",
      imageUrl: "/images/project-1.svg",
      technologies: "Next.js, TypeScript, PostgreSQL, Tailwind CSS",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com",
      year: "2025",
      role: "Design & Development",
      displayOrder: 1,
      featured: true,
    },
    {
      title: "Fieldnote",
      slug: "fieldnote",
      shortDescription:
        "An offline-first note app for researchers who work where the signal doesn't.",
      description:
        "Fieldnote is a small, dependable notebook for field research. Notes, photos, and voice memos are captured offline and sync when a connection returns.\n\nThe hard part was conflict resolution: two people editing the same observation in a forest with no network. Fieldnote resolves conflicts with a per-field merge and keeps a visible history of every change.\n\nBuilt with React Native, SQLite, and a small sync service written in Go.",
      imageUrl: "/images/project-2.svg",
      technologies: "React Native, SQLite, Go",
      liveUrl: "",
      githubUrl: "https://github.com",
      year: "2024",
      role: "Mobile Development",
      displayOrder: 2,
      featured: true,
    },
    {
      title: "Atelier",
      slug: "atelier",
      shortDescription:
        "A portfolio platform for independent studios, with an editorial publishing workflow.",
      description:
        "Atelier gives small design studios a portfolio that feels like a publication rather than a template.\n\nStudios publish projects through a structured editor — cover, narrative, credits, and gallery — and the site assembles them into long-form case studies. Everything is static-rendered for speed, with incremental updates when an editor publishes.\n\nBuilt with Next.js, Sanity, and Tailwind CSS.",
      imageUrl: "/images/project-3.svg",
      technologies: "Next.js, Sanity, Tailwind CSS",
      liveUrl: "https://example.com",
      githubUrl: "",
      year: "2024",
      role: "Front-End Development",
      displayOrder: 3,
      featured: false,
    },
  ];

  if ((await prisma.project.count()) === 0) {
    for (const project of projects) {
      await prisma.project.create({ data: project });
    }
  }

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
