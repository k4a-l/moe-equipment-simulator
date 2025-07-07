import type { Buff } from "moe-equipment-assets/types/buff";
import type { ItemBase } from "moe-equipment-assets/types/item";

export const injectBuff = <T extends ItemBase>(buffs: Buff[], item: T) => {
	const buff = buffs.find((b) => b.name === item.buff);
	return {
		...item,
		buff: buff,
	};
};
