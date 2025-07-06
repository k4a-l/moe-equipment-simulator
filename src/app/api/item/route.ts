import { injectBuff } from "@/features/dataProccess/buff";
import { getLocalData } from "../getLocalData";
import { createRoute } from "./frourio.server";

const { weapons, shields, defences, buffs } = getLocalData();

export const { POST } = createRoute({
	post: async ({ body }) => {
		const { itemIds } = body;

		return {
			status: 200,
			body: itemIds
				.map((id) => {
					return (
						weapons.find((item) => item.id === id) ||
						shields.find((item) => item.id === id) ||
						defences.find((item) => item.id === id)
					);
				})
				.filter((item) => item !== undefined)
				.map((item) => injectBuff(buffs, item)),
		};
	},
});
