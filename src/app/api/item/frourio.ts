import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";
import { itemSchemaWithBuff } from "@/types/Item";

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
