import { STATUS_UP_CALC_METHODS } from "@/types/buff";
import type { Effect, EffectSubjectType } from "@/types/effect";
import type { ItemWithBuff } from "@/types/Item";

export const flattenEffectOfItem = (item: ItemWithBuff): Effect[] => {
	return [
		...item.effects.map(
			(e): Effect => ({
				subject: e.subject,
				value: e.value,
			}),
		),
		...(item.buff?.effects ?? []).flatMap((e): Effect[] => {
			if (e.type === "statusUp") {
				return [
					{
						subject: e.subject,
						value: e.value,
						numberType: e.numberType,
					} as const,
				];
			}
			return [];
		}),
	];
};

export const joinEffectOfItem = (item: ItemWithBuff): Effect[] => {
	const effectsObject = flattenEffectOfItem(item).reduce(
		(acc, effect) => {
			const key = getEffectKey(effect);
			if (!acc[key]) {
				acc[key] = { ...effect };
			} else {
				if (
					effect.numberType === "percent" &&
					STATUS_UP_CALC_METHODS[effect.subject] === "multiply"
				) {
					acc[key].value *= effect.value;
				} else {
					acc[key].value += effect.value;
				}
			}
			return acc;
		},
		{} as Record<string, Effect>,
	);

	return Object.values(effectsObject).map((effect) => ({
		...effect,
	}));
};

export const getEffectKey = (effect: {
	subject: EffectSubjectType;
	numberType?: Effect["numberType"];
}): string => {
	return `${effect.subject}${effect.numberType ? `-${effect.numberType}` : ""}`;
};

export const getEffect = (
	effects: Effect[],
	effect: {
		subject: EffectSubjectType;
		numberType?: Effect["numberType"];
	},
) => {
	return effects.find((e) => getEffectKey(e) === getEffectKey(effect));
};
