import {
	readBuffFile,
	readDefenceFile,
	readShieldFile,
	readWeaponFile,
	writeJson,
} from "@/scripts/scrape/readWrite";
import type { Buff } from "@/types/buff";

// 装備ファイルからバフを抽出し、存在しないバフを追加するスクリプト
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
		.map(
			(i): Buff => ({
				name: i,
				unedited: true,
				effects: [],
				description: "",
			}),
		);

	const buffs = [...existsBuffs, ...newBuffs];

	console.log({
		existsBuffs: existsBuffs.length,
		new: newBuffs.length,
		total: buffs.length,
	});

	writeJson(buffs, "buffs.json");
}

main();
