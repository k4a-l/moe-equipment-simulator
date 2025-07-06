import type { EffectSubjectType } from "@/types/effect";
import type { ItemWithBuff } from "@/types/Item";

export const flattenEffectOfItem = (
	item: ItemWithBuff,
): {
	subject: EffectSubjectType;
	value: number;
	method: "add" | "multiply";
}[] => {
	return [
		...item.effects.map((e) => ({
			subject: e.subject,
			value: e.value,
			method: "add" as const,
		})),
		...(item.buff?.effects ?? []).flatMap((e) => {
			if (e.type === "statusUp") {
				return {
					subject: e.subject,
					value: e.value,
					method: e.numberType === "percent" ? "multiply" : "add",
				} as const;
			}
			return [];
		}),
	];
};

export const joinEffectOfItem = (
	item: ItemWithBuff,
): Record<
	string,
	{ subject: EffectSubjectType; value: number; method: "add" | "multiply" }
> => {
	return flattenEffectOfItem(item).reduce(
		(acc, effect) => {
			const key = `${effect.subject}-${effect.method}`;
			if (!acc[key]) {
				acc[key] = { ...effect };
			} else {
				// addの場合は加算、multiplyの場合は乗算
				if (effect.method === "multiply") {
					acc[key].value *= effect.value;
				} else {
					acc[key].value += effect.value;
				}
			}
			return acc;
		},
		{} as Record<
			string,
			{ subject: EffectSubjectType; value: number; method: "add" | "multiply" }
		>,
	);
};
