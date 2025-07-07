import type { FrourioSpec } from "@frourio/next";
import { itemSchemaWithBuff } from "moe-equipment-assets/types/item";
import { z } from "zod";
import { searchConditionQuerySchemaWithPage } from "@/features/search/searchCondition/type";

export const frourioSpec = {
	post: {
		body: searchConditionQuerySchemaWithPage,
		res: {
			200: {
				body: z.object({
					items: z.array(itemSchemaWithBuff),
					allNumber: z.number(),
				}),
			},
		},
	},
} satisfies FrourioSpec;
