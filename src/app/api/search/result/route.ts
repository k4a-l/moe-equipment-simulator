import path from "node:path";
import type { ItemWithBuff } from "moe-equipment-assets/types/item";
import { getFileList } from "@/features/api/getFile";
import { injectBuff } from "@/features/dataProccess/buff";
import { getEffect, joinEffectOfItem } from "@/features/Item/util";
import {
	searchByEffect,
	searchByIncludesWords,
	searchByOmitWords,
	searchByParts,
} from "@/features/search/util";
import { getLocalData } from "../../getLocalData";
import { createRoute } from "./frourio.server";

const { weapons, shields, defences, buffs } = getLocalData();

export const { POST } = createRoute({
	post: async ({ body }) => {
		await getFileList(process.cwd());
		await getFileList(path.join(process.cwd(), "assets"));

		const {
			includesWords,
			omitWords,
			partsConditions,
			searchConditions,
			pageIndex,
			sort,
		} = body;

		const allItems: ItemWithBuff[] = [...weapons, ...shields, ...defences].map(
			(item) => injectBuff(buffs, item),
		);

		const result = allItems.filter((item) => {
			if (!searchByIncludesWords(item, includesWords)) return false;
			if (!searchByOmitWords(item, omitWords)) return false;
			if (!searchByParts(item, partsConditions)) return false;
			if (!searchByEffect(item, searchConditions)) return false;

			return true;
		});

		const sortedResult = result
			// .filter((item) => {
			// 	if (!sort?.by) return true;
			// 	const value = getEffect(joinEffectOfItem(item), {
			// 		subject: sort.by,
			// 		numberType: sort.isPercentNumber ? "percent" : undefined,
			// 	})?.value;
			// 	if (value === undefined) return false;
			// 	return true;
			// })
			.sort((a, b) => {
				if (!sort?.by) return 0;

				const aValue = getEffect(joinEffectOfItem(a), {
					subject: sort.by,
					numberType: sort.isPercentNumber ? "percent" : undefined,
				})?.value;
				const bValue = getEffect(joinEffectOfItem(b), {
					subject: sort.by,
					numberType: sort.isPercentNumber ? "percent" : undefined,
				})?.value;

				if (sort.strategy === "asc") {
					return (aValue ?? 0) - (bValue ?? 0);
				} else {
					return (bValue ?? 0) - (aValue ?? 0);
				}
			});

		const slicedResult = sortedResult.slice(
			pageIndex * 20,
			(pageIndex + 1) * 20,
		);

		return {
			status: 200,
			body: {
				items: slicedResult,
				allNumber: sortedResult.length,
			},
		};
	},
});
