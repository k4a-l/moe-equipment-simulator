import buffsJson from "moe-equipment-assets/assets/buffs.json";
import defencesJson from "moe-equipment-assets/assets/defences.json";
import shieldsJson from "moe-equipment-assets/assets/shields.json";
import weaponsJson from "moe-equipment-assets/assets/weapons.json";
import { buffSchema } from "moe-equipment-assets/types/buff";
import {
	defenceItemSchema,
	shieldItemSchema,
	weaponItemSchema,
} from "moe-equipment-assets/types/item";
import z from "zod";

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
const defences = defenceItemsResult.data;

const BUFFs = z.array(buffSchema);
const buffsResult = BUFFs.safeParse(buffsJson);
if (!buffsResult.success) {
	console.error(buffsResult.error);
	throw Error(`Invalid buffs data:${buffsResult.error.toString()}`);
}
const buffs = buffsResult.data;

export const getLocalData = () => {
	return {
		weapons,
		shields,
		defences,
		buffs,
	};
};
