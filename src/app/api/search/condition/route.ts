import {
	EFFECT_SUBJECTS,
	type EffectSubjectType,
} from "moe-equipment-assets/types/effect";
import { injectBuff } from "@/features/dataProccess/buff";
import { getLocalData } from "../../getLocalData";
import { createRoute } from "./frourio.server";

const { weapons, shields, defences, buffs } = getLocalData();

const effectsSubjects: EffectSubjectType[] = [
	...new Set(
		[weapons, shields, defences]
			.flat()
			.map((item) => injectBuff(buffs, item))
			.flatMap((item): EffectSubjectType[] =>
				[
					item.effects.map((e) => e.subject),
					item.buff?.effects?.flatMap((e) =>
						e.type === "statusUp" ? e.subject : [],
					) ?? [],
				].flat(),
			),
	),
].sort((a, b) => {
	const order = EFFECT_SUBJECTS.map((e) => e.value as string);
	return order.indexOf(a) - order.indexOf(b);
});

export const { GET } = createRoute({
	get: async () => {
		return {
			status: 200,
			body: {
				effectsSubjects,
				buffImplementation: {
					all: buffs.length,
					implemented: buffs.filter((b) => !b.unedited).length,
				},
			},
		};
	},
});
