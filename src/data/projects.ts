import type { ProjectEntry } from "@/types";

export const projects: ProjectEntry[] = [
  {
    id: "heritage-school-app",
    kind: "named-project",
    title: "Heritage School App",
    subtitle: "Cross-platform school management application",
    description:
      "A cross-platform school management application for students and teachers. Students log in to access the session and examination calendars, school diary, notifications, class routine, attendance, tuition fee information, booklists, syllabus, and examination results. Teachers log in to access related facilities.",
    features: [
      "Student and teacher login",
      "School and examination calendars",
      "Notifications",
      "Class routines",
      "Attendance",
      "Tuition fee information",
      "Booklists and syllabus",
      "Examination results",
    ],
    technologies: ["Apache Cordova", "AngularJS", "Google Cloud Messaging", "MySQL", "APIs"],
    visualLabel: "Conceptual visual — mobile app interface",
  },
  {
    id: "brothers-online-bd",
    kind: "named-project",
    title: "Brothers Online BD",
    subtitle: "ARP-based broadband administration system",
    description:
      "An ARP-based broadband administration system that enables broadband providers to manage network information and access reports from their data server.",
    features: [
      "Network information management",
      "Data server reporting",
      "Administration controls for broadband providers",
    ],
    technologies: ["PHP", "MySQL", "Networking (ARP/TCP-IP)"],
    visualLabel: "Conceptual visual — network administration dashboard",
  },
  {
    id: "custom-erp",
    kind: "named-project",
    title: "Custom ERP System",
    subtitle: "Enterprise software — Rupashi Group of Industries",
    description:
      "Enterprise resource planning software developed while working as a Software Developer at Rupashi Group of Industries, alongside fingerprint attendance data management and multi-site IT infrastructure support for 100+ employees.",
    features: [
      "Custom ERP system development",
      "Fingerprint attendance data management",
      "Database server administration",
      "Multi-site IT infrastructure support",
    ],
    technologies: ["PHP", "MySQL"],
    visualLabel: "Conceptual visual — enterprise dashboard",
  },
  {
    id: "shopify-capabilities",
    kind: "capability-showcase",
    title: "Shopify Development",
    subtitle: "Capabilities showcase — not a single named client project",
    description:
      "A showcase of documented Shopify development capabilities built across professional engagements, distinct from the individually named projects above.",
    features: [
      "Custom Shopify themes",
      "Custom Shopify applications",
      "Third-party API integrations",
      "Payment integrations",
      "Cart and checkout recovery automation",
      "Email automation",
    ],
    technologies: ["Shopify", "Liquid", "Shopify Theme 2.0", "JavaScript", "REST APIs"],
    visualLabel: "Conceptual visual — Shopify storefront and app interface",
  },
];
