import { injectBuff } from "@/features/dataProccess/buff";
import { joinEffectOfItem } from "@/features/Item/util";
import {
	searchByEffect,
	searchByOmitWords,
	searchByParts,
} from "@/features/search/util";
import type { ItemWithBuff } from "@/types/Item";
import { getLocalData } from "../../getLocalData";
import { createRoute } from "./frourio.server";

const { weapons, shields, defences, buffs } = getLocalData();

export const { POST } = createRoute({
	post: async ({ body }) => {
		const { omitWords, partsConditions, searchConditions, pageIndex, sort } =
			body;

		const allItems: ItemWithBuff[] = [...weapons, ...shields, ...defences].map(
			(item) => injectBuff(buffs, item),
		);

		const result = allItems.filter((item) => {
			// 除外ワードがある場合はフィルタリング
			if (!searchByOmitWords(item, omitWords)) return false;
			if (!searchByParts(item, partsConditions)) return false;
			if (!searchByEffect(item, searchConditions)) return false;

			return true;
		});

		const sortedResult = result
			.filter((item) => {
				if (!sort?.by) return true;
				const value =
					joinEffectOfItem(item)[
						`${sort.by}-${sort.isPercentNumber ? "multiply" : "add"}`
					]?.value;
				if (value === undefined) return false;
				return true;
			})
			.sort((a, b) => {
				if (!sort?.by) return 0;

				const aValue =
					joinEffectOfItem(a)[
						`${sort.by}-${sort.isPercentNumber ? "multiply" : "add"}`
					]?.value;
				const bValue =
					joinEffectOfItem(b)[
						`${sort.by}-${sort.isPercentNumber ? "multiply" : "add"}`
					]?.value;

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
