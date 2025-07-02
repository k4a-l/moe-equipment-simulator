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

export const EFFECT_SUBJECTS = [
	z.literal("攻撃力"),
	z.literal("命中"),
	z.literal("物理与ダメージ"),
	z.literal("魔法ディレイ"),
	z.literal("クリティカル率"),
	z.literal("魔力"),
	z.literal("攻撃ディレイ"),
	z.literal("最大HP"),
	z.literal("最大MP"),
	z.literal("最大ST"),
	z.literal("防御力"),
	z.literal("回避"),
	z.literal("破壊スキル"),
	z.literal("神秘スキル"),
	z.literal("強化スキル"),
	z.literal("死魔スキル"),
	z.literal("回復スキル"),
	z.literal("火属性効果"),
	z.literal("水属性効果"),
	z.literal("土属性効果"),
	z.literal("風属性効果"),
	z.literal("無属性効果"),
	z.literal("HP自然回復"),
	z.literal("ST自然回復"),
	z.literal("MP自然回復"),
	z.literal("移動速度"),
	z.literal("耐火属性"),
	z.literal("耐水属性"),
	z.literal("耐地属性"),
	z.literal("耐風属性"),
	z.literal("耐無属性"),
	z.literal("SEEING"),
	z.literal("HEARING"),
	z.literal("SMELLING"),
	z.literal("最大重量"),
	z.literal("BREATH"),
	z.literal("料理ゲージ滑り"),
	z.literal("料理ゲージ速度"),
	z.literal("料理ヒットゾーン"),
	z.literal("料理グレードゾーン"),
	z.literal("複製ゲージ滑り"),
	z.literal("複製ゲージ速度"),
	z.literal("複製ヒットゾーン"),
	z.literal("複製グレードゾーン"),
	z.literal("美容ゲージ滑り"),
	z.literal("美容ゲージ速度"),
	z.literal("美容ヒットゾーン"),
	z.literal("美容グレードゾーン"),
	z.literal("キック命中率補正"),
	z.literal("キック攻撃力補正"),
	z.literal("釣りゲージ速度"),
	z.literal("釣りヒットゾーン"),
	z.literal("釣りゲージ長"),
	z.literal("醸造ゲージ滑り"),
	z.literal("醸造ゲージ速度"),
	z.literal("醸造ヒットゾーン"),
	z.literal("醸造グレードゾーン"),
	z.literal("裁縫ゲージ滑り"),
	z.literal("裁縫ゲージ速度"),
	z.literal("裁縫ヒットゾーン"),
	z.literal("裁縫グレードゾーン"),
	z.literal("大工ゲージ滑り"),
	z.literal("大工ゲージ速度"),
	z.literal("大工ヒットゾーン"),
	z.literal("大工グレードゾーン"),
	z.literal("薬調合ゲージ滑り"),
	z.literal("薬調合ゲージ速度"),
	z.literal("薬調合ヒットゾーン"),
	z.literal("薬調合グレードゾーン"),
	z.literal("装飾細工ゲージ滑り"),
	z.literal("装飾細工ゲージ速度"),
	z.literal("装飾細工ヒットゾーン"),
	z.literal("装飾細工グレードゾーン"),
	z.literal("鍛冶ゲージ滑り"),
	z.literal("鍛冶ゲージ速度"),
	z.literal("鍛冶ヒットゾーン"),
	z.literal("鍛冶グレードゾーン"),
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

export const weaponSkillSchema = z.union([
	z.literal("刀剣"),
	z.literal("槍"),
	z.literal("素手"),
	z.literal("弓"),
	z.literal("こんぼう"),
	z.literal("銃器"),
	z.literal("音楽"),
	z.literal("採掘"),
	z.literal("釣り"),
	z.literal("牙"),
	z.literal("魔法熟練"),
	z.literal("水泳"),
	z.literal("筋力"),
	z.literal("精神力"),
]);
export type WeaponSkill = z.infer<typeof weaponSkillSchema>;

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
				weapon: weaponSkillSchema, // スキル名
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
