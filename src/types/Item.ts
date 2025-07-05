import z from "zod";
import type { Buff } from "./buff";

// ------------------ 共通 ------------------ //

export const EQUIPMENT_TYPE = {
	shields: "shields",
	weapons: "weapons",
	defences: "defences",
} as const;

export type EquipmentType =
	(typeof EQUIPMENT_TYPE)[keyof typeof EQUIPMENT_TYPE];

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
] as const;

export type EffectSubjectType = (typeof EFFECT_SUBJECTS)[number]["_type"];

export const effectSubjectSchema = z.union(EFFECT_SUBJECTS);

type EffectSubject = z.infer<typeof effectSubjectSchema>;
export const effectsSchema = z.object({
	subject: effectSubjectSchema, // 効果対象
	value: z.number(), // 効果値
});

export type Effect = z.infer<typeof effectsSchema>;

// ------------------ 防具 ------------------ //

export const DEFENCE_PARTS = [
	z.literal("頭（防）"),
	z.literal("胴（防）"),
	z.literal("手（防）"),
	z.literal("腰（防）"),
	z.literal("肩（防）"),
	z.literal("パンツ（防）"),
	z.literal("靴（防）"),
	z.literal("頭（装）"),
	z.literal("顔（装）"),
	z.literal("耳（装）"),
	z.literal("指（装）"),
	z.literal("胸（装）"),
	z.literal("背中（装）"),
	z.literal("腰（装）"),
] as const;
export const defencePartsSchema = z.union(DEFENCE_PARTS);
export type DefencePart = z.infer<typeof defencePartsSchema>;

export const ItemBaseSchema = z.object({
	id: z.number(), // アイテムID
	name: z.string(), // アイテム名（多分ユニーク）
	description: z.string(), // アイテム説明
	specials: z.array(z.string()), // 特殊効果
	buff: z.string().optional(), // バフ効果（オプション）
	effects: z.array(effectsSchema), // 効果
	genderAvailable: z.union([
		z.literal("男"),
		z.literal("女"),
		z.literal("ALL"),
	]), // 多分使わないけど一応持っておく
	tribeAvailable: z.union([
		z.literal("パンデモス"),
		z.literal("ニューター"),
		z.literal("エルモニー"),
		z.literal("コグニート"),
		z.literal("ALL"),
	]), // 多分使わないけど一応持っておく
	shipAvailable: z.string(), // 多分使わないけど一応持っておく
});
export type ItemBase = z.infer<typeof ItemBaseSchema>;

export const defenceItemSchema = ItemBaseSchema.merge(
	z.object({
		type: z.literal(EQUIPMENT_TYPE.defences), // アイテムタイプ
		part: defencePartsSchema, // 装備部位
		armorClass: z.number(),
		skills: z.array(
			z.object({
				weapon: z.literal("着こなし"), // スキル名
				value: z.number(), // スキル値
			}),
		),
	}),
);

export type InjectBuff<T> = T extends ItemBase
	? Omit<T, "buff"> & { buff?: Buff }
	: T;

export type DefenceItem = z.infer<typeof defenceItemSchema>;

// ------------------ 武器 ------------------ //

export const WEAPON_PARTS = [z.literal("右手"), z.literal("左手")] as const;
export const weaponPartsSchema = z.union(WEAPON_PARTS);
export type WeaponPart = z.infer<typeof weaponPartsSchema>;

export const weaponItemSchema = ItemBaseSchema.merge(
	z.object({
		type: z.literal(EQUIPMENT_TYPE.weapons), // アイテムタイプ
		parts: z.array(weaponPartsSchema), // 装備部位
		both: z.boolean().optional(), // 両手持ちかどうか
		damage: z.number(), // グレード
		attackDelay: z.number(), // 攻撃間隔
		attackRange: z.number(), // 攻撃範囲
		skills: z.array(
			z.object({
				weapon: allSkillSchema, // スキル名
				value: z.number(), // スキル値
			}),
		),
	}),
);
export type WeaponItem = z.infer<typeof weaponItemSchema>;

// ------------------ 盾 ------------------ //
export const shieldItemSchema = ItemBaseSchema.merge(
	z.object({
		type: z.literal(EQUIPMENT_TYPE.shields), // アイテムタイプ
		part: weaponPartsSchema, // 装備部位
		armorClass: z.number(), // グレード
		skills: z.array(
			z.object({
				weapon: z.literal("盾"), // スキル名
				value: z.number(), // スキル値
			}),
		),
		avoidance: z.number(), // 回避率
	}),
);
export type ShieldItem = z.infer<typeof shieldItemSchema>;

// ------------------ アイテム全体 ------------------ //
export type Item = DefenceItem | WeaponItem | ShieldItem;
