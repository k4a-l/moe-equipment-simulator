"use client";

import { useState } from "react";
import type { Buff } from "@/types/buff";
import type { DefenceItem, ShieldItem, WeaponItem } from "@/types/Item";
import { injectBuff } from "../dataProccess/buff";
import { Sheet } from "./Sheet";
import type { ItemOfPart } from "./type";

type SavedItemOfParts = Omit<ItemOfPart, "item"> & {
	itemId: number;
};

export function SheetContainer({
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
	const savedItemOfPartsTmp: SavedItemOfParts[] = [
		{
			type: "weapons",
			part: "左手",
			itemId: weapons.at(-1)?.id,
		},
		{
			type: "weapons",
			part: "右手",
			itemId: weapons.at(-2)?.id,
		},
		{
			type: "defences",
			part: "頭（防）",
			itemId: 18709,
		},
		{
			type: "defences",
			part: "胴（防）",
			itemId: 18523,
		},
		{
			type: "defences",
			part: "手（防）",
			itemId: defenceItems.at(-2)?.id,
		},
		{
			type: "defences",
			part: "腰（防）",
			itemId: defenceItems.at(-3)?.id,
		},
		{
			type: "defences",
			part: "肩（防）",
			itemId: defenceItems.at(-4)?.id,
		},
		{
			type: "defences",
			part: "パンツ（防）",
			itemId: defenceItems.at(-5)?.id,
		},
		{
			type: "defences",
			part: "靴（防）",
			itemId: defenceItems.at(-6)?.id,
		},
		{
			type: "defences",
			part: "頭（装）",
			itemId: defenceItems.at(-7)?.id,
		},
		{
			type: "defences",
			part: "顔（装）",
			itemId: defenceItems.at(-8)?.id,
		},
		{
			type: "defences",
			part: "耳（装）",
			itemId: defenceItems.at(-9)?.id,
		},
		{
			type: "defences",
			part: "指（装）",
			itemId: defenceItems.at(-10)?.id,
		},
		{
			type: "defences",
			part: "胸（装）",
			itemId: defenceItems.at(-11)?.id,
		},
		{
			type: "defences",
			part: "背中（装）",
			itemId: defenceItems.at(-12)?.id,
		},
		{
			type: "defences",
			part: "腰（装）",
			itemId: defenceItems.at(-12)?.id,
		},
	];

	const [savedItemOfParts, saveItemOfParts] =
		useState<SavedItemOfParts[]>(savedItemOfPartsTmp);

	const s: ItemOfPart[] = savedItemOfParts.map((part): ItemOfPart => {
		const item =
			part.type === "weapons"
				? weapons.find((w) => w.id === part.itemId)
				: part.type === "defences"
					? defenceItems.find((d) => d.id === part.itemId)
					: shields.find((s) => s.id === part.itemId);

		if (!item) return { part: part.part, type: part.type } as ItemOfPart;

		return {
			...part,
			item: injectBuff(buffs, item),
		} as ItemOfPart;
	});

	return <Sheet savedItemOfParts={s} />;
}
