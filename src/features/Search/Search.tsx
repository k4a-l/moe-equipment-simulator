"use client";

import type { ColDef } from "ag-grid-community";
import { useCallback, useMemo, useState } from "react";
import type z from "zod";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	type DefenceItem,
	EFFECT_SUBJECTS,
	type EffectSubjectType,
	type InjectBuff,
	type Item,
	type ShieldItem,
	type WeaponItem,
} from "@/types/Item";
import { SearchConditionContainer } from "./SearchCondition/SearchConditionContainer";
import type {
	SearchConditionType,
	searchConditionsSchema,
} from "./SearchCondition/type";
import { SearchResult } from "./SearchResult/SearchResult";

export function Search({
	weapons,
	shields,
	defences,
}: {
	weapons: InjectBuff<WeaponItem>[];
	shields: InjectBuff<ShieldItem>[];
	defences: InjectBuff<DefenceItem>[];
}) {
	const [searchResults, setSearchResults] = useState<InjectBuff<Item>[]>(
		weapons.slice(-20, -1),
	);

	const execSearch = useCallback(
		(
			partConditions: string[],
			omitWords: string | undefined,
			searchConditions: z.infer<typeof searchConditionsSchema>,
		) => {
			console.log("検索実行", partConditions);
			// 検索実行のロジックをここに追加
			setSearchResults(
				[...weapons, ...shields, ...defences].filter((item) => {
					// 除外ワードがある場合はフィルタリング
					if (omitWords) {
						const omitWordsArray = omitWords
							.split(",")
							.map((word) => word.trim());
						const targetTexts = [item.name, item.description, ...item.specials];
						if (
							omitWordsArray.some((word) =>
								targetTexts.some((text) => text.includes(word)),
							)
						) {
							return false;
						}
					}

					// 部位
					const partsFilter = () => {
						if (partConditions.length === 0) return true;
						return partConditions.some((part) => {
							if (item.type === "weapons") {
								return (item.parts as string[]).includes(part);
							}
							return item.part === part;
						});
					};
					if (partsFilter() === false) return false;

					const itemEffectsRaw: {
						subject: EffectSubjectType;
						value: number;
						method: "add" | "multiply";
					}[] = [
						...item.effects.map((e) => ({
							subject: e.subject,
							value: e.value,
							method: "add" as const,
						})),
						...(item.buff?.effects ?? []).flatMap((e) => {
							if (e.type === "statusUp") {
								return {
									subject: e.subject,
									value: e.value,
									method: e.method,
								};
							}
							return [];
						}),
					];
					// 同じsubjectで同じmethodのものをまとめる
					const itemEffects = itemEffectsRaw.reduce(
						(acc, effect) => {
							const key = `${effect.subject}-${effect.method}`;
							if (!acc[key]) {
								acc[key] = { ...effect };
							} else {
								// addの場合は加算、multiplyの場合は乗算
								if (effect.method === "multiply") {
									acc[key].value *= effect.value;
								} else {
									acc[key].value += effect.value;
								}
							}
							return acc;
						},
						{} as Record<
							string,
							{
								subject: EffectSubjectType;
								value: number;
								method: "add" | "multiply";
							}
						>,
					);

					const effectFilter = (condition: SearchConditionType) => {
						const effectValue =
							itemEffects[`${condition.subject}-${condition.valueType}`]?.value;
						if (effectValue === undefined) return false;
						if (
							condition.maxValue !== undefined &&
							effectValue > condition.maxValue
						)
							return false;
						if (
							condition.minValue !== undefined &&
							effectValue < condition.minValue
						)
							return false;
						return true;
					};

					if (!searchConditions.every((condition) => effectFilter(condition)))
						return false;

					return true;
				}),
			);
		},
		[weapons, defences, shields],
	);

	const effectsSubjects: string[] = useMemo(
		() =>
			[
				...new Set(
					[weapons, shields, defences]
						.flatMap((item): string[] =>
							[
								item.flatMap((i) => i.effects.map((e) => e.subject)),
								item.flatMap(
									(i) =>
										i.buff?.effects?.flatMap((e) =>
											e.type === "statusUp" ? e.subject : [],
										) ?? [],
								),
							].flat(),
						)
						.flat(),
				),
			].sort((a, b) => {
				const order = EFFECT_SUBJECTS.map((e) => e.value as string);
				return order.indexOf(a) - order.indexOf(b);
			}),
		[defences, shields, weapons],
	);

	const searchResultsSubjects: string[] = useMemo(() => {
		const subjectsWithMethod = [
			...new Set(
				searchResults.flatMap((item) => [
					...item.effects.map((e) => `${e.subject}-add`),
					...(item.buff?.effects?.flatMap((e) =>
						e.type === "statusUp" ? `${e.subject}-${e.method}` : [],
					) ?? []),
				]),
			),
		].map((subject) => {
			const [subjectName, method] = subject.split("-");
			return { subjectName, method };
		});

		return subjectsWithMethod
			.sort((a, b) => {
				const order = EFFECT_SUBJECTS.map((e) => e.value as string);
				return order.indexOf(a.subjectName) - order.indexOf(b.subjectName);
			})
			.map((e) => `${e.subjectName}${e.method === "multiply" ? "(倍率)" : ""}`);
	}, [searchResults]);

	console.log(searchResultsSubjects);

	const [searchConditions, setSearchConditions] = useState<
		SearchConditionType[]
	>([{ uuid: crypto.randomUUID(), valueType: "add" }]);

	const rowData = useMemo(
		() =>
			searchResults.map((r) => {
				type Effect = { value: number; method: string };
				const effects: Record<string, Effect[]> = {};

				r.effects.forEach((e) => {
					if (!effects[e.subject]) {
						effects[e.subject] = [];
					}
					effects[e.subject].push({
						value: e.value,
						method: "add",
					});
				});

				(r.buff?.effects ?? []).forEach((e) => {
					if (e.type !== "statusUp") return;
					if (!effects[e.subject]) {
						effects[e.subject] = [];
					}
					effects[e.subject].push({
						value: e.value,
						method: e.method,
					});
				});

				// subjectごとに、addとmultiplyをまとめる
				const mergedEffects: Record<
					string /* subject */,
					{ add?: number; multiply?: number }
				> = {};

				Object.entries(effects).forEach(([subject, effectList]) => {
					effectList.forEach((effect) => {
						if (!mergedEffects[subject]) {
							mergedEffects[subject] = {};
						}
						if (effect.method === "add") {
							mergedEffects[subject].add =
								(mergedEffects[subject].add ?? 0) + effect.value;
						} else if (effect.method === "multiply") {
							mergedEffects[subject].multiply =
								(mergedEffects[subject].multiply ?? 1) * effect.value;
						}
					});
				});

				// addの場合はsubjectのみ、multiplyの場合はsubject(倍率)とする
				const mergedEffectsFormatted: Record<string, number> = {};
				Object.entries(mergedEffects).forEach(([subject, effect]) => {
					if (effect.add !== undefined) {
						mergedEffectsFormatted[subject] = effect.add;
					}
					if (effect.multiply !== undefined) {
						mergedEffectsFormatted[`${subject}(倍率)`] = effect.multiply;
					}
				});

				return {
					...mergedEffectsFormatted,
					name: r.name,
				};
			}),
		[searchResults],
	);

	const colDefs = useMemo<ColDef[]>(
		() => [
			{ field: "name", headerName: "アイテム名" },
			...searchResultsSubjects.map((subject) => ({
				field: subject,
				headerName: subject,
			})),
		],
		[searchResultsSubjects],
	);

	return (
		<div className="flex gap-2 flex-col">
			<Accordion type="multiple" defaultValue={["item-1"]}>
				<AccordionItem value="item-1" defaultChecked>
					<AccordionTrigger>
						<p className="font-bold text-md">検索条件</p>
					</AccordionTrigger>
					<AccordionContent>
						<SearchConditionContainer
							conditions={searchConditions}
							setConditions={setSearchConditions}
							effectsSubjects={effectsSubjects}
							execSearch={execSearch}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<p className="font-bold text-md">検索結果</p>
			<SearchResult rows={rowData} cols={colDefs} />
		</div>
	);
}
