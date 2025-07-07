"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type Row,
	useReactTable,
} from "@tanstack/react-table";
import { produce } from "immer";
import {
	AlertCircleIcon,
	MinusIcon,
	PlusIcon,
	ShieldIcon,
	ShirtIcon,
	SwordIcon,
} from "lucide-react";
import type { Buff } from "moe-equipment-assets/types/buff";
import {
	EFFECT_SUBJECTS,
	type EffectSubjectType,
} from "moe-equipment-assets/types/effect";
import {
	DEFENCE_PARTS,
	type DefencePart,
	type ItemWithBuff,
	WEAPON_PARTS,
	type WeaponPart,
} from "moe-equipment-assets/types/item";
import {
	type ComponentProps,
	type Dispatch,
	memo,
	type SetStateAction,
	useMemo,
	useState,
} from "react";
import type { StrictExtract } from "ts-essentials";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { strictEntries, strictFromEntries, strictKeys } from "@/utils/objects";
import { joinEffectOfItem } from "../Item/util";
import { Search } from "../search/Search";
import { GroupInput, ItemDetail } from "./Row";
import {
	BASE_STATUS_KEYS,
	type BaseStatus,
	type ItemOfPart,
	type WithGroup,
} from "./type";

export type Data =
	| {
			type: "part";
			部位: DefencePart | WeaponPart;
			group?: number;
			rowId: string;
			item?: ItemWithBuff;
	  }
	| {
			type: "base";
			effects: Record<EffectSubjectType, number>;
			baseStatuses: BaseStatus;
	  }
	| {
			type: "total";
			group: number;
			itemOfParts: ItemOfPart[];
			baseStatuses: BaseStatus;
	  };

const getBaseStatus = (
	baseStatus: BaseStatus,
	subject: EffectSubjectType,
): number | undefined => {
	if (subject.startsWith("耐")) {
		return baseStatus.抵抗;
	}
	if (BASE_STATUS_KEYS.includes(subject as keyof BaseStatus)) {
		return baseStatus[subject as keyof BaseStatus];
	}
	return undefined;
};

export const createEquipSimKey = (key: string) => `equip-sim-${key}`;

const columnHelper = createColumnHelper<Data & Record<string, unknown>>();

export function EquipSimByCharacter({
	itemOfParts,
	baseStatuses,
	setBaseStatuses,
	setItemOfParts,
}: {
	itemOfParts: ItemOfPart[];
	baseStatuses: BaseStatus;
	setBaseStatuses: Dispatch<SetStateAction<BaseStatus>>;
	setItemOfParts: Dispatch<SetStateAction<ItemOfPart[]>>;
}) {
	const [selectPart, setSelectItem] = useState<
		| { part: string; onSelect: ComponentProps<typeof Search>["onSelect"] }
		| undefined
	>();

	const effectSubjects = useMemo<EffectSubjectType[]>(
		() =>
			[
				...new Set(
					[
						itemOfParts.flatMap((part): EffectSubjectType[] => [
							...part.items
								.filter((i) => i.id !== undefined)
								.flatMap((i): EffectSubjectType[] =>
									i.effects.map((e) => e.subject),
								),
							...part.items
								.filter((i) => i.id !== undefined)
								.flatMap((i) => i.buff?.effects ?? [])
								.flatMap((b) => (b.type === "statusUp" ? b.subject : [])),
						]),
						strictKeys(baseStatuses).flatMap((key): EffectSubjectType[] =>
							key === "抵抗"
								? ["耐火属性", "耐水属性", "耐地属性", "耐風属性", "耐無属性"]
								: [key],
						),
					].flat(),
				),
			].sort((a, b) => {
				const order = EFFECT_SUBJECTS.map((e) => e.value as string);
				return order.indexOf(a) - order.indexOf(b);
			}),
		[itemOfParts, baseStatuses],
	);

	const allBuffs = useMemo<WithGroup<Buff>[]>(() => {
		return itemOfParts.flatMap((item): WithGroup<Buff>[] =>
			item.items
				.filter((i) => i.id !== undefined)
				.flatMap((i) => (i.buff ? [{ ...i.buff, group: i.group }] : [])),
		);
	}, [itemOfParts]);

	const sameBuffs = useMemo<Map<string, number>>(() => {
		const map = new Map<string, number>();
		for (const buff of allBuffs) {
			if (map.has(buff.name)) {
				map.set(buff.name, (map.get(buff.name) ?? 0) + 1);
			} else {
				map.set(buff.name, 1);
			}
		}
		// 2以上の重複があるものだけを抽出
		for (const [key, value] of map.entries()) {
			if (value <= 1) {
				map.delete(key);
			}
		}
		return map;
	}, [allBuffs]);

	const duplicatedGroup: { subject: string; group: string; names: string[] }[] =
		(() => {
			const buffMap = new Map<
				string /* subject */,
				Map<string, /* group */ string[] /* names */>
			>();

			for (const part of itemOfParts) {
				for (const item of part.items.filter((i) => i.id !== undefined)) {
					if (!item.buff) continue;
					for (const effect of item.buff?.effects ?? []) {
						if (effect.type !== "statusUp") continue;
						if (effect.group === undefined) continue;

						const key = effect.subject;
						const existing = buffMap.get(key) ?? new Map<string, string[]>();

						if (!existing.has(effect.group)) {
							existing.set(effect.group, []);
						}

						existing.get(effect.group)?.push(item.buff.name);
						buffMap.set(key, existing);
					}
				}
			}

			// 同じsubjectで同じgroupで複数のアイテムがあるものだけを抽出
			const result: { subject: string; group: string; names: string[] }[] = [];
			for (const [subject, groups] of buffMap.entries()) {
				for (const [group, names] of groups.entries()) {
					if (names.length > 1) {
						result.push({ subject, group, names });
					}
				}
			}

			// 返す
			return result;
		})();

	const columns = useMemo(() => {
		console.log("columns");
		const result = [
			columnHelper.display({
				id: "部位",
				cell: (info) => {
					if (info.row.original.type === "base") {
						return <span className="flex justify-center">基礎</span>;
					}
					if (info.row.original.type === "total") {
						return <span className="flex justify-center"> 合計</span>;
					}
					const original = info.row.original;
					return (
						<div className="flex items-center justify-between gap-2">
							<Button
								asChild
								variant={"secondary"}
								size="icon"
								className="cursor-pointer size-6 p-1"
								onClick={() => {
									if (
										original.item &&
										!window.confirm(`${original.item.name}を削除しますか？`)
									) {
										return;
									}
									setItemOfParts((prev) => {
										return produce(prev, (draft) => {
											const part = draft.find(
												(item) => item.part === original.部位,
											);
											if (!part) return;
											part.items = part.items.filter(
												(item): item is typeof item =>
													item.rowId !== original.rowId,
											);
										});
									});
								}}
							>
								<MinusIcon />
							</Button>
							{original.部位}
							<Button
								asChild
								variant={"secondary"}
								size="icon"
								className="cursor-pointer size-6 p-1"
								onClick={() => {
									setItemOfParts((prev) => {
										return produce(prev, (draft) => {
											const part = draft.find(
												(item) => item.part === original.部位,
											);
											if (!part) return draft;
											part.items.push({
												rowId: crypto.randomUUID(),
												id: undefined,
												group:
													Math.max(...part.items.map((i) => i.group ?? 0), 0) +
													1,
											});
										});
									});
								}}
							>
								<PlusIcon />
							</Button>
						</div>
					);
				},
				header: () => <span>部位</span>,
			}),
			columnHelper.accessor("グループ", {
				id: "グループ",
				cell: (info) => {
					return <GroupInput info={info} setItemOfParts={setItemOfParts} />;
				},
				header: () => <span>グループ</span>,
				meta: {
					getCellContext: () => ({
						className: "text-center",
					}),
				},
			}),
			columnHelper.display({
				id: "アイテム",
				cell: (info) => {
					const original = info.row.original;
					if (original.type === "base") {
						return null;
					}
					if (original.type === "total") {
						return null;
					}
					return (
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() => {
								setSelectItem({
									part: original.部位,
									onSelect: (selectedItem) => {
										if (!window.confirm(`${selectedItem.name}を選択しますか？`))
											return;

										setItemOfParts((prev) => {
											return produce(prev, (draft) => {
												const part = draft.find(
													(item) => item.part === original.部位,
												);
												if (!part) {
													draft.push({
														type: selectedItem.type,
														part: original.部位,
														items: [
															{ ...selectedItem, rowId: crypto.randomUUID() },
														],
													});
													return;
												}

												const itemIndex = part.items.findIndex(
													(i) => i.rowId === original.rowId,
												);
												const item = part.items[itemIndex];

												if (itemIndex === 1 || !item) {
													part.items.push({
														...selectedItem,
														rowId: crypto.randomUUID(),
													});
													return;
												}

												part.items.splice(itemIndex, 1, {
													...item,
													...selectedItem,
												});
											});
										});
										setSelectItem(undefined);
									},
								});
							}}
						>
							{original.item?.type === "weapons" ? (
								<SwordIcon className="h-1" />
							) : original.item?.type === "defences" ? (
								<ShirtIcon className="h-1" />
							) : original.item?.type === "shields" ? (
								<ShieldIcon className="h-1" />
							) : null}

							{original.item?.name ?? "未選択 >>"}
						</Button>
					);
				},
				header: () => <span>アイテム</span>,
				meta: {
					getCellContext: () => ({
						className:
							"flex justify-between items-center sticky left-0 shadow-none w-full",
					}),
				},
			}),
			...effectSubjects.map((subject) =>
				columnHelper.accessor(subject, {
					id: subject,
					cell: (info) => {
						if (info.row.original.type === "base") {
							const baseStatuses = info.row.original.baseStatuses;
							return getBaseStatus(baseStatuses, subject);
						}
						if (info.row.original.type === "total") {
							const group = info.row.original.group;
							const itemOfParts = info.row.original.itemOfParts;
							const baseStatuses = info.row.original.baseStatuses;

							const total = itemOfParts
								.reduce((acc, cur) => {
									const item = [...cur.items]
										.filter((i) => i.id !== undefined)
										.sort((a, b) => (b?.group ?? 0) - (a?.group ?? 0))
										.find((i) => (i.group ?? 0) <= group);

									if (!item) return acc;
									const effects = joinEffectOfItem(item).filter(
										(e) => e.subject === subject,
									);

									const staticValue = effects
										.filter((e) => e.numberType !== "percent")
										.reduce((sum, e) => sum + e.value, 0);
									const multiplyValue =
										1 +
										effects
											.filter((e) => e.numberType === "percent")
											.reduce((product, e) => product + e.value, 0) /
											100;

									return (acc + staticValue) * multiplyValue;
								}, getBaseStatus(baseStatuses, subject) ?? 0)
								.toFixed(1);
							return total;
						}

						const item = info.row.original.item;
						return (
							<span key={subject} className="text-center">
								{[
									item?.effects
										.filter((e) => e.subject === subject)
										?.map((e) => e.value),
									item?.buff?.effects?.map((e) =>
										e.type === "statusUp" && e.subject === subject
											? `${e.value}${e.numberType === "percent" ? "%" : ""}`
											: undefined,
									) ?? [],
								]
									.flat()
									.filter((e) => e !== undefined)
									.join(" / ")}
							</span>
						);
					},
					header: () => <span>{subject.replace(/属性/, "")}</span>,
					meta: {
						getCellContext: () => ({
							className: "text-center",
						}),
					},
				}),
			),
			columnHelper.display({
				id: "バフ",
				cell: (info) => {
					if (info.row.original.type === "base") {
						return null;
					}
					if (info.row.original.type === "total") {
						const group = info.row.original.group;
						const itemOfParts = info.row.original.itemOfParts;
						const currentItems = itemOfParts.flatMap(
							(part) =>
								[...part.items]
									.filter((i) => i.id !== undefined)
									.sort((a, b) => (b?.group ?? 0) - (a?.group ?? 0))
									.find((i) => (i.group ?? 0) <= group) ?? [],
						);
						const currentBuffs = currentItems.filter((i) => i.buff);

						return `${currentBuffs.length} 個`;
					}

					const item = info.row.original.item;
					if (!item?.buff) return null;
					return (
						<Badge variant={"secondary"} className="w-full h-full">
							{item?.buff?.name}
						</Badge>
					);
				},
				header: () => <span>バフ</span>,
				meta: {
					getCellContext: () => ({
						className: "text-center",
					}),
				},
			}),
			columnHelper.display({
				id: "詳細",
				cell: (info) => {
					const original = info.row.original;
					if (original.type === "base") {
						return null;
					}
					if (original.type === "total") {
						return null;
					}
					if (!original.item) {
						return null;
					}

					return <ItemDetail item={original.item} />;
				},
				header: () => <span>詳細</span>,
				meta: {
					getCellContext: () => ({
						className: "text-center",
					}),
				},
			}),
		];
		return result;
	}, [effectSubjects, setItemOfParts]);

	const rowData = useMemo<Data[]>(() => {
		const baseRow: Data = {
			type: "base",
			baseStatuses: baseStatuses,
			effects: strictFromEntries(
				strictEntries(baseStatuses).flatMap(
					([key, value]): [EffectSubjectType, number][] => {
						if (key === "抵抗") {
							return [
								["耐火属性", value] as const,
								["耐水属性", value] as const,
								["耐地属性", value] as const,
								["耐風属性", value] as const,
								["耐無属性", value] as const,
							];
						}

						return [[key, value] as const];
					},
				),
			),
		};
		const itemRows = [...WEAPON_PARTS, ...DEFENCE_PARTS].flatMap(
			(PART): Data[] => {
				const items = itemOfParts.find((p) => p.part === PART.value)?.items;
				if (!items?.length) {
					return [
						{
							type: "part",
							部位: PART.value,
							group: undefined,
							rowId: crypto.randomUUID(),
						},
					];
				}

				return items.map((item): Data => {
					return {
						type: "part",
						部位: PART.value,
						group: item.group,
						rowId: item.rowId,
						...(item.id ? { item: item } : {}),
					};
				});
			},
		);

		const partGroups: number[] = [
			...new Set([
				0,
				...itemOfParts.flatMap((part) =>
					part.items
						.filter((i) => i.id !== undefined)
						.map((item) => item.group ?? 0),
				),
			]),
		].sort((a, b) => a - b);
		const totalRows: StrictExtract<Data, { type: "total" }>[] = partGroups.map(
			(group) => {
				return {
					type: "total",
					group: group,
					itemOfParts,
					baseStatuses,
				};
			},
		);

		return [baseRow, ...itemRows, ...totalRows];
	}, [itemOfParts, baseStatuses]);

	const table = useReactTable({
		data: rowData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col gap-2">
			<p className="text-2xl">基礎</p>
			<p>武器や弾自体の攻撃力も基礎に含める</p>
			<div className="flex border-1 rounded-md overflow-clip">
				<Table className="compact-table table-fixed">
					<TableHeader>
						<TableRow>
							{Object.keys(baseStatuses).map((key) => (
								<TableHead key={key}>{key}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							{Object.entries(baseStatuses).map(([key, value]) => (
								<TableCell key={key}>
									<Input
										type="number"
										value={value}
										onChange={(e) => {
											const newValue = e.target.value
												? Number(e.target.value)
												: undefined;
											setBaseStatuses((prev) => ({
												...prev,
												[key]: newValue ?? null,
											}));
										}}
									/>
								</TableCell>
							))}
						</TableRow>
					</TableBody>
				</Table>
			</div>

			<div className="h-4" />

			<p className="text-2xl">装備</p>
			{/* アラート */}
			{sameBuffs.size > 0 && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>重複バフがあります</AlertTitle>
					<AlertDescription>
						<ul>
							{Array.from(sameBuffs.entries()).map(([name, count]) => (
								<li key={name}>
									{name} x{count}
								</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}
			{duplicatedGroup.length > 0 && (
				<Alert variant="destructive">
					<AlertCircleIcon />
					<AlertTitle>同グループバフがあります</AlertTitle>
					<AlertDescription>
						<ul>
							{duplicatedGroup.map((group) => (
								<li key={group.subject}>
									{group.subject}: {group.group} : {group.names.join(", ")}
								</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}
			<div className="border rounded-md">
				<Table className="compact-table grid-table bg-white">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-center">
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => {
							return <TableRowComp key={row.id} row={row} />;
						})}
					</TableBody>
				</Table>
			</div>
			{selectPart && (
				<Dialog
					open={!!selectPart}
					onOpenChange={(open) => {
						if (open) return;
						setSelectItem(undefined);
					}}
				>
					<DialogContent
						onEscapeKeyDown={(e) => e.preventDefault()}
						onInteractOutside={(e) => e.preventDefault()}
						className="!w-[98vw] !h-[90vh] max-w-[98vw]! max-h-full! py-8 overflow-auto p-0"
					>
						<div className="py-8 px-4 flex min-w-0 w-full">
							<DialogHeader className="h-0 hidden">
								<DialogTitle></DialogTitle>
							</DialogHeader>
							<Search
								staticPart={selectPart.part}
								onSelect={selectPart.onSelect}
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

const TableRowComp = memo(({ row }: { row: Row<Data> }) => {
	return (
		<TableRow key={row.id}>
			{row.getVisibleCells().map((cell) => {
				const meta = cell.getContext().cell.column.columnDef.meta;
				const { className, ...cellProps } =
					meta?.getCellContext?.(cell.getContext()) ?? {};
				const isTotalRow = row.original.type === "total";

				const groupColor = (() => {
					if (!(row.original.type === "part" || row.original.type === "total"))
						return "";

					const group = row.original.group ?? 0;
					const code = 255 - group * 5;
					return `rgb(${group % 3 === 0 ? code : 255}, ${group % 3 === 1 ? code : 255}, ${group % 3 === 2 ? code : 255})`;
				})();

				return (
					<TableCell
						key={cell.id}
						{...cellProps}
						className={`${className} ${isTotalRow ? "font-bold min-h-8 bg-gray-100" : ""}`}
						style={{ backgroundColor: groupColor }}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				);
			})}
		</TableRow>
	);
});
