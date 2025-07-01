import { type DefenceItem, EQUIPMENT_TYPE } from "@/types/Item";
import { fetchItemsOfThisIndexPage } from "./modules";
import { readDefenceFile, writeJson } from "./readWrite";

async function main() {
	// const number = await getIndexNumber("shields");
	// console.log(`Index number for shields: ${number}`);
	// // weapons
	// {
	// 	const newItems: WeaponItem[] = [];
	// 	for (let i = 200; i <= 250; i++) {
	// 		console.log("Fetching page:", i);
	// 		const r = await fetchItemsOfThisIndexPage(EQUIPMENT_TYPE.weapons, i);
	// 		newItems.push(...r);
	// 		console.log("End");
	// 	}
	// 	// console.dir(newItems, { depth: null });
	// 	// // 既存のデータを取得
	// 	const existingItems = getWeaponFile();
	// 	const keySet = new Set(newItems.map((item) => item.name));
	// 	// nameをキーとしてすでに存在する場合は上書き。なければ追加
	// 	const items: WeaponItem[] = [
	// 		...existingItems.filter((item) => {
	// 			return !keySet.has(item.name);
	// 		}),
	// 		...newItems,
	// 	];
	// 	saveJson(
	// 		items.sort((a, b) => a.id - b.id),
	// 		`${EQUIPMENT_TYPE.weapons}.json`,
	// 	);
	// }
	// shields;
	// {

	// 	// 既存のデータを取得
	// 	const existingItems = getShieldFile();
	// 	const keySet = new Set(newItems.map((item) => item.name));
	// 	// nameをキーとしてすでに存在する場合は上書き。なければ追加
	// 	const items: ShieldItem[] = [
	// 		...existingItems.filter((item) => {
	// 			return !keySet.has(item.name);
	// 		}),
	// 		...newItems,
	// 	];
	// 	saveJson(items, `${EQUIPMENT_TYPE.shields}.json`);
	// }
	// defences
	{
		const newItems: DefenceItem[] = [];
		for (let i = 401; i <= 1859; i++) {
			console.log("Fetching page:", i);
			const r = await fetchItemsOfThisIndexPage(EQUIPMENT_TYPE.defences, i);
			newItems.push(...r);
			console.log("End");
		}

		// 既存のデータを取得
		const existingItems = readDefenceFile();
		const keySet = new Set(newItems.map((item) => item.name));
		// nameをキーとしてすでに存在する場合は上書き。なければ追加
		const items: DefenceItem[] = [
			...existingItems.filter((item) => {
				return !keySet.has(item.name);
			}),
			...newItems,
		];
		writeJson(items, `${EQUIPMENT_TYPE.defences}.json`);
	}
}
main();
