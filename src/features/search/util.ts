import type { ItemWithBuff } from "@/types/Item";
import { getEffect, joinEffectOfItem } from "../Item/util";
import type { SearchConditionType } from "./searchCondition/type";

export const searchByIncludesWords = (
	item: ItemWithBuff,
	includeWords?: string,
) => {
	if (!includeWords) return true;
	const includeWordsArray = includeWords.split(",").map((word) => word.trim());
	const targetTexts = [item.name, item.description, ...item.specials];
	return includeWordsArray.some((word) =>
		targetTexts.some((text) => text.includes(word)),
	);
};

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
		if (!condition.subject) return;
		const effectValue =
			getEffect(effectJoined, {
				subject: condition.subject,
				numberType: condition.numberType,
			})?.value ?? 0;
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
