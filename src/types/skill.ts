import { z } from "zod";

export const BATTLE_SKILLS = [
	z.literal("筋力"),
	z.literal("着こなし"),
	z.literal("攻撃回避"),
	z.literal("生命力"),
	z.literal("知能"),
	z.literal("持久力"),
	z.literal("精神力"),
	z.literal("集中力"),
	z.literal("呪文抵抗"),
] as const;

export const MASTERY_SKILLS = [
	z.literal("素手"),
	z.literal("刀剣"),
	z.literal("こんぼう"),
	z.literal("槍"),
	z.literal("銃器"),
	z.literal("弓"),
	z.literal("盾"),
	z.literal("投げ"),
	z.literal("牙"),
	z.literal("罠"),
	z.literal("キック"),
	z.literal("戦闘技術"),
	z.literal("酩酊"),
	z.literal("物まね"),
	z.literal("調教"),
	z.literal("破壊"),
	z.literal("回復"),
	z.literal("神秘"),
	z.literal("召喚"),
	z.literal("強化"),
	z.literal("死魔"),
	z.literal("魔法熟練"),
	z.literal("自然調和"),
	z.literal("暗黒命令"),
	z.literal("取引"),
	z.literal("シャウト"),
	z.literal("音楽"),
	z.literal("盗み"),
	z.literal("ギャンブル"),
	z.literal("パフォーマンス"),
	z.literal("ダンス"),
] as const;

export const BASE_SKILLS = [
	z.literal("落下耐性"),
	z.literal("水泳"),
	z.literal("死体回収"),
	z.literal("包帯"),
	z.literal("自然回復"),
	z.literal("採掘"),
	z.literal("伐採"),
	z.literal("収穫"),
	z.literal("釣り"),
	z.literal("解読"),
];

export const MANUFACTURE_SKILLS = [
	z.literal("料理"),
	z.literal("鍛冶"),
	z.literal("醸造"),
	z.literal("大工"),
	z.literal("裁縫"),
	z.literal("薬調合"),
	z.literal("装飾細工"),
	z.literal("複製"),
	z.literal("栽培"),
	z.literal("美容"),
] as const;

export const ALL_SKILLS = [
	...BATTLE_SKILLS,
	...BASE_SKILLS,
	...MASTERY_SKILLS,
	...MANUFACTURE_SKILLS,
] as const;
export const allSkillSchema = z.union(ALL_SKILLS);
export type AllSkill = z.infer<typeof allSkillSchema>;
