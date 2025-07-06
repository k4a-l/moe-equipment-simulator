import { injectBuff } from "@/features/dataProccess/buff";
import { EFFECT_SUBJECTS } from "@/types/effect";
import { getLocalData } from "../../getLocalData";
import { createRoute } from "./frourio.server";

const { weapons, shields, defences, buffs } = getLocalData();

const effectsSubjects = [
	...new Set(
		[weapons, shields, defences]
			.flat()
			.map((item) => injectBuff(buffs, item))
			.flatMap((item): string[] =>
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
		return { status: 200, body: { effectsSubjects } };
	},
});
