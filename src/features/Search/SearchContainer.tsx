import { useMemo } from "react";
import type { Buff } from "@/types/buff";
import type { DefenceItem, ShieldItem, WeaponItem } from "@/types/Item";
import { injectBuff } from "../dataProccess/buff";
import { Search } from "./Search";

export function SearchContainer({
	weapons,
	shields,
	defenceItems,
	buffs,
}: {
	weapons: WeaponItem[];
	shields: ShieldItem[];
	defenceItems: DefenceItem[];
	buffs: Buff[];
}) {
	const weaponWithBuffs = useMemo(() => {
		return weapons.map((w) => injectBuff(buffs, w));
	}, [weapons, buffs]);
	const shieldWithBuffs = useMemo(() => {
		return shields.map((s) => injectBuff(buffs, s));
	}, [shields, buffs]);
	const defenceItemsWithBuffs = useMemo(() => {
		return defenceItems.map((d) => injectBuff(buffs, d));
	}, [defenceItems, buffs]);

	return (
		<Search
			weapons={weaponWithBuffs}
			shields={shieldWithBuffs}
			defences={defenceItemsWithBuffs}
		/>
	);
}
