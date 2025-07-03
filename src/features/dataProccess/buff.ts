import type { Buff } from "@/types/buff";
import type { ItemBase } from "@/types/Item";

export const injectBuff = <T extends ItemBase>(buffs: Buff[], item: T) => {
	const buff = buffs.find((b) => b.name === item.buff);
	return {
		...item,
		buff: buff,
	};
};
