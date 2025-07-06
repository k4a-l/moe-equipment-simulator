import type { ItemWithBuff } from "@/types/Item";
import { joinEffectOfItem } from "../Item/util";
import type { SearchConditionType } from "./searchCondition/type";

export const searchByOmitWords = (item: ItemWithBuff, omitWords?: string) => {
	if (!omitWords) return true;
	const omitWordsArray = omitWords.split(",").map((word) => word.trim());
	const targetTexts = [item.name, item.description, ...item.specials];
	return !omitWordsArray.some((word) =>
		targetTexts.some((text) => text.includes(word)),
	);
};

export const searchByParts = (
	item: ItemWithBuff,
	partsConditions: string[],
) => {
	if (partsConditions.length === 0) return true;
	return partsConditions.some((part) => {
		if (item.type === "weapons") {
			return (item.parts as string[]).includes(part);
		}
		return item.part === part;
	});
};

export const searchByEffect = (
	item: ItemWithBuff,
	searchConditions: SearchConditionType[],
) => {
	const effectJoined = joinEffectOfItem(item);

	const effectFilter = (condition: SearchConditionType) => {
		const effectValue =
			effectJoined[`${condition.subject}-${condition.valueType}`]?.value;
		if (effectValue === undefined) return false;
		if (condition.maxValue !== undefined && effectValue > condition.maxValue)
			return false;
		if (condition.minValue !== undefined && effectValue < condition.minValue)
			return false;
		return true;
	};

	if (!searchConditions.every((condition) => effectFilter(condition)))
		return false;

	return true;
};
