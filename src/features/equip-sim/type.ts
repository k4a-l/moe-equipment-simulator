import type { StrictOmit } from "ts-essentials";
import z from "zod";
import {
	defencePartsSchema,
	equipmentTypeSchema,
	itemSchemaWithBuff,
	weaponPartsSchema,
} from "@/types/Item";
import { strictFromEntries } from "@/utils/objects";

export type WithGroup<T> = T & {
	group?: number;
};

export const ItemOfPartSchema = z.object({
	type: equipmentTypeSchema,
	part: z.union([...weaponPartsSchema.options, ...defencePartsSchema.options]),
	items: z.array(
		z.intersection(
			z.object({
				rowId: z.string(),
				group: z.number().optional(),
			}),
			z.union([
				itemSchemaWithBuff,
				z.object({
					id: z.undefined(),
				}),
			]),
		),
	),
});
export type ItemOfPart = z.infer<typeof ItemOfPartSchema>;

export const savedItemOfPartSchema = ItemOfPartSchema.extend({
	group: z.number().optional(),
	items: z.array(
		z.object({
			id: z.number().optional(),
			group: z.number().optional(),
		}),
	),
});
export type SavedItemOfParts = z.infer<typeof savedItemOfPartSchema>;

export const BASE_STATUS_KEYS = [
	"最大HP",
	"最大ST",
	"最大MP",
	"攻撃力",
	"命中",
	"魔力",
	"防御力",
	"回避",
	"抵抗",
] as const;

export const DEFAULT_BASE_STATUS: BaseStatus = strictFromEntries(
	BASE_STATUS_KEYS.map((key) => [key, 0] as const),
);

export const baseStatusSchema = z.object({
	最大HP: z.number().min(0),
	最大ST: z.number().min(0),
	最大MP: z.number().min(0),
	攻撃力: z.number().min(0),
	命中: z.number().min(0),
	魔力: z.number().min(0),
	防御力: z.number().min(0),
	回避: z.number().min(0),
	抵抗: z.number().min(0),
}) satisfies z.ZodType<Record<(typeof BASE_STATUS_KEYS)[number], number>>;

export type BaseStatus = z.infer<typeof baseStatusSchema>;

export const savedCharacterSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	parts: z.array(savedItemOfPartSchema),
	baseStatuses: baseStatusSchema,
});

export type SavedCharacter = z.infer<typeof savedCharacterSchema>;

export type Character = StrictOmit<SavedCharacter, "parts"> & {
	parts: ItemOfPart[];
};
