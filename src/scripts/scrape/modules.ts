import { chromium, type ElementHandle, type Page } from "playwright";
import {
	type DefenceItem,
	type DefencePart,
	type Effect,
	EQUIPMENT_TYPE,
	type EquipmentType,
	type Item,
	type ItemBase,
	type ShieldItem,
	type WeaponItem,
	type WeaponPart,
	type WeaponSkill,
} from "@/types/Item";
import { sleep } from "@/utils/time";
import { BASE_URL } from "./constants";

export async function getMainElementOfPage(
	page: Page,
): Promise<ElementHandle<HTMLElement | SVGElement> | null> {
	const appDiv = await page.$("div#app");
	if (!appDiv) {
		console.error("App div not found");
		return null;
	}

	const mainDiv = await appDiv?.$("div.mx-auto div.align-middle");
	if (!mainDiv) {
		console.error("Main div not found");
		return null;
	}

	return mainDiv;
}

export async function getIndexNumber(category: EquipmentType): Promise<number> {
	const url = new URL(category as string, BASE_URL);
	const urlString = url.toString();

	// アクセス
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	// 待ち
	await page.goto(urlString, { waitUntil: "load" });
	await page.waitForLoadState("networkidle");

	const mainDiv = await getMainElementOfPage(page);

	console.log("END LOADED");

	const indexList = await mainDiv?.$("div.flex ul");
	if (!indexList) {
		console.error("Index list not found");
		await browser.close();
		return 0;
	}

	const links = await indexList.$$("a");
	if (links.length < 2) {
		console.error("Not enough links found");
		await browser.close();
		return 0;
	}

	const secondLastLink = links[links.length - 2];
	if (!secondLastLink) {
		console.error("Second last link not found");
		await browser.close();
		return 0;
	}

	const textContent = await secondLastLink.textContent();
	if (!textContent) {
		console.error("Text content not found in second last link");

		await browser.close();
		return 0;
	}
	const indexNumber = parseInt(textContent.trim(), 10);
	if (Number.isNaN(indexNumber)) {
		console.error("Parsed index number is NaN");
		await browser.close();
		return 0;
	}

	console.log("END EVALUATE");

	return indexNumber;
}

export async function getItemInfoByElement<EQ_T extends EquipmentType>(
	element: ElementHandle<HTMLElement>,
	eqType: EQ_T,
): Promise<Extract<Item, { type: EQ_T }> | undefined> {
	function getContentByTitle(
		title: string,
	): Promise<ElementHandle<HTMLElement | SVGElement> | null> {
		return titleElement.$(`dt:has-text("${title}") + dd`);
	}

	// 子要素が3つあるので、それぞれを抽出
	const [titleElement, imageElement, abilityElement] = await element.$$("div");

	if (!titleElement || !imageElement || !abilityElement) {
		console.error("One or more required elements not found");
		return undefined;
	}

	// 名前
	const nameElement = await titleElement.$("h1 > a");
	const itemUrl = await nameElement?.getAttribute("href");
	// https://idb.moepic.com/items/defences/22828 から22828を抽出
	const _itemId = itemUrl?.match(/\/(\d+)$/)?.[1];
	if (!_itemId) {
		console.error("Item ID not found in URL");
		return undefined;
	}
	const itemId = Number(_itemId);
	const _name = await nameElement?.textContent();
	const name = _name ? _name.trim() : "";
	if (name.length === 0) {
		console.error("Item name is empty");
		return undefined;
	}

	// 説明
	const description = await (await titleElement.$(".text-base"))?.textContent();

	const partElement = await getContentByTitle("装備部位");
	const part = (await partElement?.textContent())?.trim() ?? "";

	// 必要スキル
	const skillWrapperElement = await getContentByTitle("必要スキル");
	const skillsElement = (await skillWrapperElement?.$$("div")) ?? [];
	const skills: { weapon: string; value: number }[] = (
		await Promise.all(
			skillsElement.map(
				async (el): Promise<{ weapon: string; value: number } | null> => {
					const text = await el.textContent();
					if (!text) return null;

					const [weapon, value] = text.trim().split(" ");
					if (!weapon || !value) {
						console.error("Weapon or value is missing in skills");
						return null;
					}
					return { weapon, value: Number(value) };
				},
			),
		)
	).filter((e) => e !== null);

	// 付加効果
	const buffElement = await getContentByTitle("付加効果");
	// <br>タグの前部分だけ取得
	const _buffText = (await buffElement?.innerHTML())?.split("<br>")[0].trim();
	const buffText = _buffText?.trim() || "";

	// 追加効果
	const effectsWrapperElement = await getContentByTitle("追加効果");
	const effectsElement = (await effectsWrapperElement?.$$("li")) ?? [];
	const effects: Effect[] = (
		await Promise.all(
			effectsElement.flatMap(async (el): Promise<Effect | null> => {
				const effectText = await el.textContent();
				if (!effectText) return null;

				const [effectSubject, effectValue] = effectText.split(" ");
				if (!effectSubject || !effectValue) {
					console.error("Effect subject or value is missing");
					return null;
				}
				return {
					subject: effectSubject as Effect["subject"],
					value: Number(effectValue.trim()),
				} satisfies Effect;
			}),
		)
	).filter((e) => e != null);

	// 特殊条件
	const specialWrapperElement = await getContentByTitle("特殊条件");
	const specialElement = (await specialWrapperElement?.$$("li")) ?? [];
	const specials: string[] = (
		await Promise.all(
			specialElement.flatMap(async (el): Promise<string | null> => {
				const text = await el.textContent();
				if (!text) return null;
				return text.trim();
			}),
		)
	).filter((e) => e != null);

	// アーマークラス
	const armorClassElement = await getContentByTitle("アーマークラス");
	const _armorClass = (await armorClassElement?.textContent())?.trim();
	const armorClass =
		_armorClass !== undefined ? Number(_armorClass) : undefined;

	// 使用可能種族
	const tribeAvailableElement = await getContentByTitle("使用可能種族");
	const tribeAvailable =
		(await tribeAvailableElement?.textContent())?.trim() ?? "";

	// 使用可能性別
	const genderAvailableElement = await getContentByTitle("使用可能性別");
	const genderAvailable =
		(await genderAvailableElement?.textContent())?.trim() ?? "";

	// 使用可能シップ
	const shipAvailableElement = await getContentByTitle("使用可能シップ");
	const shipAvailable =
		(await shipAvailableElement?.textContent())?.trim() ?? "";

	const itemBase: ItemBase = {
		id: itemId,
		name: name,
		tribeAvailable: tribeAvailable as ShieldItem["tribeAvailable"],
		genderAvailable: genderAvailable as ShieldItem["genderAvailable"],
		shipAvailable: shipAvailable as ShieldItem["shipAvailable"],
		description: description?.trim() || "",
		buff: buffText,
		specials: specials,
		effects: effects,
	};

	if (eqType === EQUIPMENT_TYPE.shields) {
		// 回避
		const avoidanceElement = await getContentByTitle("回避");
		const _avoidance = (await avoidanceElement?.textContent())?.trim();
		if (_avoidance === undefined) {
			console.error("Avoidance value is missing");
			return undefined;
		}
		const avoidance = Number(_avoidance.replace("%", ""));

		if (armorClass === undefined) {
			console.error("Armor class value is missing");
			return undefined;
		}

		const item: ShieldItem = {
			...itemBase,
			type: "shields",
			part: part as WeaponPart,
			armorClass: armorClass,
			skills: skills.map((s) => ({
				weapon: "盾",
				value: s.value,
			})),
			avoidance: avoidance,
		};
		return item as Extract<Item, { type: EQ_T }>;
	} else if (eqType === EQUIPMENT_TYPE.weapons) {
		// 攻撃間隔
		const attackDelayElement = await getContentByTitle("攻撃間隔");
		const _attackDelay = (await attackDelayElement?.textContent())?.trim();
		if (_attackDelay === undefined) {
			console.error("Attack delay value is missing");
			return undefined;
		}
		const attackDelay = Number(_attackDelay);

		// ダメージ
		const damageElement = await getContentByTitle("ダメージ");
		const _damage = (await damageElement?.textContent())?.trim();
		if (_damage === undefined) {
			console.error("Damage value is missing");
			return undefined;
		}
		const damage = Number(_damage);

		// 有効レンジ
		const attackRangeElement = await getContentByTitle("有効レンジ");
		const _attackRange = (await attackRangeElement?.textContent())?.trim();
		const attackRange = _attackRange ? Number(_attackRange) : 0; //

		const parts = part.split(" ");

		const item: WeaponItem = {
			...itemBase,
			type: "weapons",
			parts: parts.filter((p) => !p.includes("HAND")) as WeaponPart[],
			both: parts.includes("2HAND"),
			skills: skills.map((s) => ({
				weapon: s.weapon as WeaponSkill,
				value: s.value,
			})),
			attackDelay: attackDelay,
			damage: damage,
			attackRange: attackRange,
		};

		return item as Extract<Item, { type: EQ_T }>;
	} else if (eqType === EQUIPMENT_TYPE.defences) {
		if (armorClass === undefined) {
			console.error("Armor class value is missing");
			return undefined;
		}

		const item: DefenceItem = {
			...itemBase,
			type: "defences",
			part: part as DefencePart,
			armorClass: armorClass,
			skills: skills.map((s) => ({
				weapon: "着こなし",
				value: s.value,
			})),
		};

		return item as Extract<Item, { type: EQ_T }>;
	}

	return undefined;
}

export async function getItemElements(
	element: ElementHandle<HTMLElement | SVGElement>,
): Promise<ElementHandle<HTMLElement>[]> {
	// アイテムの要素を取得
	const itemElement = await element.$$("main");
	if (!itemElement || itemElement.length === 0) {
		console.error("No item elements found");
		return [];
	}
	return itemElement;
}

export async function fetchItemsOfThisIndexPage<EQ_T extends EquipmentType>(
	eqType: EQ_T,
	pageNumber: number,
): Promise<Extract<Item, { type: EQ_T }>[]> {
	const url = new URL(eqType as string, BASE_URL);
	url.searchParams.set("page", String(pageNumber));
	const urlString = url.toString();

	// アクセス
	const browser = await chromium.launch();
	const page = await browser.newPage();

	// 待ち

	await retry(() => page.goto(urlString, { waitUntil: "domcontentloaded" }));

	const mainDiv = await getMainElementOfPage(page);
	if (!mainDiv) {
		console.error("Main div not found");
		await browser.close();
		return [];
	}

	const itemElements = await getItemElements(mainDiv);

	const items: Extract<Item, { type: EQ_T }>[] = [];
	for (const itemElement of itemElements) {
		const item = await getItemInfoByElement(itemElement, eqType);
		if (!item) continue;
		items.push(item);
	}

	// DOMからデータを抽出
	await browser.close();
	return items;
}

export const retry = async <T>(
	fn: () => Promise<T>,
	retryDelay = 100,
	numRetries = 3,
) => {
	for (let i = 0; i < numRetries; i++) {
		try {
			return await fn();
		} catch (e) {
			console.log(`Retrying... (${i + 1}/${numRetries})`);
			if (i === numRetries - 1) throw e;
			await sleep(retryDelay);
			retryDelay = retryDelay * 2;
		}
	}
};
