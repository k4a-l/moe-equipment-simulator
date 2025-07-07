import type { FrourioSpec } from "@frourio/next";
import { itemSchemaWithBuff } from "moe-equipment-assets/types/item";
import { z } from "zod";

export const frourioSpec = {
	post: {
		body: z.object({
			itemIds: z.array(z.number()),
			// parts: z.union([
			// 	...weaponPartsSchema.options,
			// 	...defencePartsSchema.options,
			// ]),
		}),
		res: { 200: { body: z.array(itemSchemaWithBuff) } },
	},
} satisfies FrourioSpec;
