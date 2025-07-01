import {
	readBuffFile,
	readDefenceFile,
	readShieldFile,
	readWeaponFile,
	writeJson,
} from "@/scripts/scrape/readWrite";
import type { Buff } from "@/types/Item";

async function main() {
	const existsBuffs = readBuffFile();

	const weaponItems = readWeaponFile();
	const defenceItems = readDefenceFile();
	const shieldItems = readShieldFile();

	const buffSet = new Set(
		[...weaponItems, ...defenceItems, ...shieldItems].flatMap(
			(b) => b.buff || [],
		),
	);
	const newBuffs: Buff[] = [...buffSet]
		.filter((buffName) => !existsBuffs.find((eb) => eb.name === buffName))
		.map((i) => ({
			name: i,
			unedited: true,
			effects: [] as unknown as Buff["effects"],
		}));

	const buffs = [...existsBuffs, ...newBuffs];

	console.log({
		existsBuffs: existsBuffs.length,
		new: newBuffs.length,
		total: buffs.length,
	});

	writeJson(buffs, "buffs.json");
}

main();
