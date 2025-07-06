import z from "zod";
import { type Buff, buffSchema } from "./buff";
import { effectsSchema } from "./effect";
import { allSkillSchema } from "./skill";

// ------------------ 共通 ------------------ //

export const EQUIPMENT_TYPE = {
	shields: "shields",
	weapons: "weapons",
	defences: "defences",
} as const;

export const equipmentTypeSchema = z.union([
	z.literal(EQUIPMENT_TYPE.shields),
	z.literal(EQUIPMENT_TYPE.weapons),
	z.literal(EQUIPMENT_TYPE.defences),
]);
export type EquipmentType =
	(typeof EQUIPMENT_TYPE)[keyof typeof EQUIPMENT_TYPE];

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

export const itemSchema = z.union([
	defenceItemSchema,
	weaponItemSchema,
	shieldItemSchema,
]);
export type Item = DefenceItem | WeaponItem | ShieldItem;

export const itemSchemaWithBuff = z.union([
	defenceItemSchema.extend({
		buff: buffSchema.optional(),
	}),
	weaponItemSchema.extend({
		buff: buffSchema.optional(),
	}),
	shieldItemSchema.extend({
		buff: buffSchema.optional(),
	}),
]);
export type ItemWithBuff = z.infer<typeof itemSchemaWithBuff>;
