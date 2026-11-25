import { skillCategories } from "@/data/skills";
import type { SkillCategoryId } from "@/types";

export const ORBIT_CENTER: [number, number, number] = [0.5, 1.35, -0.7];
export const ORBIT_RADIUS = 1.5;

export interface OrbitNode {
  id: SkillCategoryId;
  title: string;
  position: [number, number, number];
}

export const orbitNodes: OrbitNode[] = skillCategories.map((cat, i) => {
  const angle = (i / skillCategories.length) * Math.PI * 2;
  const tier = i % 2 === 0 ? 1 : 0.72;
  const height = i % 2 === 0 ? 0 : 0.3;
  const radius = ORBIT_RADIUS * tier;
  return {
    id: cat.id,
    title: cat.title,
    position: [
      ORBIT_CENTER[0] + Math.cos(angle) * radius,
      ORBIT_CENTER[1] + height,
      ORBIT_CENTER[2] + Math.sin(angle) * radius,
    ],
  };
});

export function worldPositionForCategory(id: SkillCategoryId): [number, number, number] | null {
  const node = orbitNodes.find((n) => n.id === id);
  return node ? node.position : null;
}

export function categoryForSkillName(skillName: string): SkillCategoryId | null {
  const cat = skillCategories.find((c) => c.skills.some((s) => s.name === skillName));
  return cat ? cat.id : null;
}
