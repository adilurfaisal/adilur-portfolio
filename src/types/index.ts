export interface SocialLink {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "mail" | "globe";
}

export interface ResumeVariant {
  id: "full-stack" | "backend" | "shopify";
  label: string;
  description: string;
  fileName: string;
  primary?: boolean;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  yearsExperience: number;
  location: string;
  email: string;
  /** Hidden from public UI by default; surfaced only via explicit reveal. */
  phone: string;
  website: string;
  socials: SocialLink[];
  summary: string;
  aboutParagraphs: string[];
  highlights: string[];
}

export type SkillCategoryId =
  | "frontend"
  | "backend"
  | "data-apis"
  | "ecommerce"
  | "infrastructure"
  | "additional";

export interface Skill {
  name: string;
  description: string;
}

export interface SkillCategory {
  id: SkillCategoryId;
  title: string;
  description: string;
  skills: Skill[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  current: boolean;
  responsibilities: string[];
  /** Set when the CV lists an open-ended "Present" date that should be verified before publishing. */
  needsVerification?: boolean;
}

export type ProjectKind = "named-project" | "capability-showcase";

export interface ProjectEntry {
  id: string;
  kind: ProjectKind;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  technologies: string[];
  visualLabel: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface ServiceEntry {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  ongoing: boolean;
}

export interface LanguageEntry {
  name: string;
  level: string;
}
