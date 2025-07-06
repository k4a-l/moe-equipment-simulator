import z from "zod";
import { MANUFACTURE_SKILLS, MASTERY_SKILLS } from "./skill";

export const MANUFACTURE_PROCESS = [
	z.literal("ゲージ滑り"),
	z.literal("ゲージ速度"),
	z.literal("ヒットゾーン"),
	z.literal("グレードゾーン"),
	z.literal("マスターグレードゾーン"),
] as const;

export const RESISTANCE = [
	z.literal("耐火属性"),
	z.literal("耐水属性"),
	z.literal("耐地属性"),
	z.literal("耐風属性"),
	z.literal("耐無属性"),
] as const;

const MANUFACTURE_SUBJECTS = MANUFACTURE_SKILLS.flatMap((skill) =>
	MANUFACTURE_PROCESS.map((proc) =>
		z.literal(`${skill.value}${proc.value}` as const),
	),
);

export const EFFECT_SUBJECTS = [
	z.literal("攻撃力"),
	z.literal("命中"),
	z.literal("物理与ダメージ率"),
	z.literal("魔法与ダメージ率"),
	z.literal("魔法ディレイ"),
	z.literal("クリティカル率"),
	z.literal("魔力"),
	z.literal("攻撃ディレイ"),
	z.literal("最大HP"),
	z.literal("最大MP"),
	z.literal("最大ST"),
	z.literal("防御力"),
	z.literal("回避"),
	...MASTERY_SKILLS,
	z.literal("ペット経験値率"),
	z.literal("火属性効果率"),
	z.literal("水属性効果率"),
	z.literal("土属性効果率"),
	z.literal("風属性効果率"),
	z.literal("無属性効果率"),
	z.literal("HP自然回復"),
	z.literal("ST自然回復"),
	z.literal("MP自然回復"),
	z.literal("移動速度"),
	z.literal("水中速度"),
	z.literal("耐全属性"),
	...RESISTANCE,
	z.literal("SEEING"),
	z.literal("HEARING"),
	z.literal("SMELLING"),
	z.literal("最大重量"),
	z.literal("所持重量"),
	z.literal("ジャンプ力率"),
	z.literal("BREATH"),
	...MANUFACTURE_SUBJECTS,
	z.literal("キック命中率補正"),
	z.literal("キック攻撃力補正"),
	z.literal("釣りゲージ速度"),
	z.literal("釣りヒットゾーン"),
	z.literal("釣りゲージ長"),
	z.literal("泳ぎ速度"),
	z.literal("牙命中率補正"),
	z.literal("牙攻撃補正"),
	z.literal("栽培ゲージ速度"),
	z.literal("盗み補正"),
	z.literal("潤喉度"),
	z.literal("満腹度"),
	z.literal("ピッキング失敗回数補正"),
	z.literal("ピッキング回転速度補正"),
	z.literal("攻撃範囲増加"),
] as const;

export type EffectSubjectType = (typeof EFFECT_SUBJECTS)[number]["_type"];

export const effectSubjectSchema = z.union(EFFECT_SUBJECTS);

type EffectSubject = z.infer<typeof effectSubjectSchema>;
export const effectsSchema = z.object({
	subject: effectSubjectSchema, // 効果対象
	value: z.number(), // 効果値
});

export type Effect = z.infer<typeof effectsSchema>;
