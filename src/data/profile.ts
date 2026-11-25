import type { Profile, ResumeVariant } from "@/types";

export const profile: Profile = {
  name: "Adilur Rahman",
  role: "Full-Stack Developer",
  tagline:
    "I build scalable web applications, powerful backend systems, and modern e-commerce experiences.",
  yearsExperience: 9,
  location: "Narayanganj, Dhaka, Bangladesh",
  email: "adilur.faisal@gmail.com",
  phone: "+8801515626304",
  website: "https://butechbd.com",
  socials: [
    { label: "GitHub", url: "https://github.com/adilurfaisal", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/adilur-faisal", icon: "linkedin" },
    { label: "Website", url: "https://butechbd.com", icon: "globe" },
  ],
  summary:
    "Full-stack developer with 9+ years of professional experience across PHP/Laravel, Node.js, and modern JavaScript frameworks (Vue, React, Next, Nuxt), plus Python/FastAPI. Builds scalable web applications, e-commerce solutions, and custom software, with a strong focus on performance, security, and user experience.",
  aboutParagraphs: [
    "I am a full-stack developer with over nine years of professional experience building scalable web applications, backend systems, and custom e-commerce solutions.",
    "My expertise spans PHP, Laravel, Node.js, Python, and modern JavaScript frameworks. I also specialize in Shopify theme and application development, API integrations, and IT infrastructure.",
    "I enjoy solving complex technical problems and turning business requirements into reliable, user-friendly digital products.",
  ],
  highlights: [
    "9+ years of professional experience",
    "Full-stack application development",
    "Backend systems and API engineering",
    "Shopify theme and app development",
    "Linux and IT infrastructure",
  ],
};

export const resumeVariants: ResumeVariant[] = [
  {
    id: "full-stack",
    label: "Full-Stack Developer",
    description: "Primary resume covering end-to-end web application development.",
    fileName: "cv-adilur-rahman-full-stack-developer-2026-11-23.pdf",
    primary: true,
  },
  {
    id: "backend",
    label: "Backend Developer",
    description: "Focused on server-side systems, APIs, databases, and Linux infrastructure.",
    fileName: "cv-adilur-rahman-backend-developer-2026-11-23.pdf",
  },
  {
    id: "shopify",
    label: "Senior Shopify Developer",
    description: "Focused on Shopify theme and app development, and e-commerce integrations.",
    fileName: "cv-adilur-rahman-senior-shopify-developer-2026-11-23.pdf",
  },
];
