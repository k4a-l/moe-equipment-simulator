import fs from "node:fs";
import path from "node:path";
import type { Buff } from "@/types/buff";
import {
	type DefenceItem,
	EQUIPMENT_TYPE,
	type ShieldItem,
	type WeaponItem,
} from "@/types/Item";

const ASSETS_DIR = "assets";

export function writeJson(data: unknown, filename: string) {
	if (!fs.existsSync(ASSETS_DIR)) {
		fs.mkdirSync(ASSETS_DIR);
	}
	fs.writeFileSync(
		path.join(ASSETS_DIR, filename),
		JSON.stringify(data, null, 4),
		"utf-8",
	);
	console.log(`Data saved to ${path.join(ASSETS_DIR, filename)}`);
}

export function readAssetsFile(filename: string): string | undefined {
	const filePath = path.join(ASSETS_DIR, filename);
	if (!fs.existsSync(filePath)) {
		console.error(`File not found: ${filePath}`);
		return undefined;
	}
	return fs.readFileSync(filePath, "utf-8");
}

export function readShieldFile(): ShieldItem[] {
	const data = readAssetsFile(`${EQUIPMENT_TYPE.shields}.json`);
	if (!data) return [];
	try {
		const items: ShieldItem[] = JSON.parse(data);
		return items;
	} catch (error) {
		console.error(`Error parsing ${EQUIPMENT_TYPE.shields}:`, error);
		return [];
	}
}

export function readDefenceFile(): DefenceItem[] {
	const data = readAssetsFile(`${EQUIPMENT_TYPE.defences}.json`);
	if (!data) return [];
	try {
		const items: DefenceItem[] = JSON.parse(data);
		return items;
	} catch (error) {
		console.error(`Error parsing ${EQUIPMENT_TYPE.defences}:`, error);
		return [];
	}
}

export function readWeaponFile(): WeaponItem[] {
	const data = readAssetsFile(`${EQUIPMENT_TYPE.weapons}.json`);
	if (!data) return [];
	try {
		const items: WeaponItem[] = JSON.parse(data);
		return items;
	} catch (error) {
		console.error(`Error parsing ${EQUIPMENT_TYPE.weapons}:`, error);
		return [];
	}
}

export function readBuffFile(): Buff[] {
	const data = readAssetsFile(`buffs.json`);
	if (!data) return [];
	try {
		const buffs: Buff[] = JSON.parse(data);
		return buffs;
	} catch (error) {
		console.error(`Error parsing buff:`, error);
		return [];
	}
}
