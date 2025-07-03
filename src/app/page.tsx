import z from "zod";
import { SearchContainer } from "@/features/Search/SearchContainer";
import { SheetContainer } from "@/features/Sheet/SheetContainer";
import { buffSchema } from "@/types/buff";
import {
	defenceItemSchema,
	shieldItemSchema,
	weaponItemSchema,
} from "@/types/Item";
import buffsJson from "/assets/buffs.json";
import defencesJson from "/assets/defences.json";
import shieldsJson from "/assets/shields.json";
import weaponsJson from "/assets/weapons.json";

const SHIELD_ITEMS = z.array(shieldItemSchema);
const r = SHIELD_ITEMS.safeParse(shieldsJson);
if (!r.success) {
	console.error(r.error);
	throw Error("Invalid shields data:");
}
const shields = r.data;
const WEAPON_ITEMS = z.array(weaponItemSchema);
const r2 = WEAPON_ITEMS.safeParse(weaponsJson);
if (!r2.success) {
	console.error(r2.error);
	throw Error("Invalid weapons data:");
}
const weapons = r2.data;
const DEFENCE_ITEMS = z.array(defenceItemSchema);
const defenceItemsResult = DEFENCE_ITEMS.safeParse(defencesJson);
if (!defenceItemsResult.success) {
	console.error(defenceItemsResult.error);
	throw Error("Invalid defences data:");
}
const defenceItems = defenceItemsResult.data;

const BUFFs = z.array(buffSchema);
const buffsResult = BUFFs.safeParse(buffsJson);
if (!buffsResult.success) {
	console.error(buffsResult.error);
	throw Error("Invalid buffs data:");
}
const buffs = buffsResult.data;

export default function Home() {
	return (
		<div className="p-4">
			<SheetContainer
				weapons={weapons}
				shields={shields}
				defenceItems={defenceItems}
				buffs={buffs}
			/>
			<SearchContainer
				weapons={weapons}
				shields={shields}
				defenceItems={defenceItems}
				buffs={buffs}
			/>
		</div>
	);
}
