import fs from "node:fs";
import path from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { buffSchema } from "@/types/buff";
import {
	defenceItemSchema,
	shieldItemSchema,
	weaponItemSchema,
} from "../types/Item";

// 共通
const outDir = path.join(__dirname, "../../assets/schemas");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writeSchemaFile(schema: unknown, name: string) {
	const out = {
		$schema: "http://json-schema.org/draft-07/schema#",
		type: "array",
		items: schema,
	};
	fs.writeFileSync(
		path.join(outDir, `${name}.schema.json`),
		JSON.stringify(out, null, 2),
		"utf-8",
	);
}

// JSON Schemaに変換
const shieldItemJsonSchema =
	zodToJsonSchema(shieldItemSchema, "ShieldItem").definitions?.ShieldItem ||
	zodToJsonSchema(shieldItemSchema, "ShieldItem");
const weaponItemJsonSchema =
	zodToJsonSchema(weaponItemSchema, "WeaponItem").definitions?.WeaponItem ||
	zodToJsonSchema(weaponItemSchema, "WeaponItem");
const defenceItemJsonSchema =
	zodToJsonSchema(defenceItemSchema, "DefenceItem").definitions?.DefenceItem ||
	zodToJsonSchema(defenceItemSchema, "DefenceItem");
const buffJsonSchema =
	zodToJsonSchema(buffSchema, "Buff").definitions?.Buff ||
	zodToJsonSchema(buffSchema, "Buff");

// 書き出し
writeSchemaFile(shieldItemJsonSchema, "shields");
writeSchemaFile(weaponItemJsonSchema, "weapons");
writeSchemaFile(defenceItemJsonSchema, "defences");
writeSchemaFile(buffJsonSchema, "buffs");

console.log("JSON Schemas generated in assets/schemas/");
