"use client";

import { AlertCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Buff } from "@/types/buff";
import {
	DEFENCE_PARTS,
	EFFECT_SUBJECTS,
	EQUIPMENT_TYPE,
	WEAPON_PARTS,
} from "@/types/Item";
import { ItemCells, SumCells } from "./Row";
import type { ItemOfPart } from "./type";

export function Sheet({
	savedItemOfParts,
}: {
	savedItemOfParts: ItemOfPart[];
}) {
	const [itemOfParts] = useState<ItemOfPart[]>(savedItemOfParts);

	const [baseStatus, setBaseStatus] = useState<{
		最大HP: number;
		最大ST: number;
		最大MP: number;
		攻撃力: number;
		命中: number;
		魔力: number;
		防御力: number;
		回避: number;
		抵抗: number;
	}>({
		最大HP: 0,
		最大ST: 0,
		最大MP: 0,
		攻撃力: 0,
		命中: 0,
		魔力: 0,
		防御力: 0,
		回避: 0,
		抵抗: 0,
	});

	const effectSubjects: string[] = [
		...new Set(
			[
				itemOfParts.flatMap((item): string[] => [
					...(item.item?.effects.map((e) => e.subject) ?? []),
					...(item.item?.buff?.effects?.flatMap((e) =>
						e.type === "statusUp" ? e.subject : [],
					) ?? []),
				]),
				Object.keys(baseStatus).flatMap((key) =>
					key === "抵抗"
						? ["耐火属性", "耐水属性", "耐地属性", "耐風属性", "耐無属性"]
						: key,
				),
			].flat(),
		),
	].sort((a, b) => {
		const order = EFFECT_SUBJECTS.map((e) => e.value as string);
		return order.indexOf(a) - order.indexOf(b);
	});

	const currentBuffs = useMemo<Buff[]>(() => {
		return itemOfParts.flatMap((item) => item.item?.buff ?? []);
	}, [itemOfParts]);
	const sameBuffs = useMemo<Map<string, number>>(() => {
		const map = new Map<string, number>();
		for (const buff of currentBuffs) {
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
	}, [currentBuffs]);

	const duplicatedGroup: { subject: string; group: string; names: string[] }[] =
		(() => {
			const buffMap = new Map<
				string /* subject */,
				Map<string, /* group */ string[] /* names */>
			>();

			for (const item of itemOfParts) {
				if (!item.item?.buff) continue;
				for (const effect of item.item.buff.effects ?? []) {
					if (effect.type !== "statusUp") continue;
					if (effect.group === undefined) continue;

					const key = effect.subject;
					const existing = buffMap.get(key) ?? new Map<string, string[]>();

					if (!existing.has(effect.group)) {
						existing.set(effect.group, []);
					}

					existing.get(effect.group)?.push(item.item.buff.name);
					buffMap.set(key, existing);
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

	return (
		<div className="flex flex-col gap-2">
			<p className="text-2xl">基礎</p>
			<p>武器や弾自体の攻撃力も基礎に含める</p>
			<div className="flex border-1 rounded-md overflow-clip">
				<Table className="compact-table">
					<TableHeader>
						<TableRow>
							{Object.keys(baseStatus).map((key) => (
								<TableHead key={key}>{key}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							{Object.entries(baseStatus).map(([key, value]) => (
								<TableCell key={key}>
									<Input
										type="number"
										value={value}
										onChange={(e) => {
											const newValue = Number(e.target.value);
											setBaseStatus((prev) => ({
												...prev,
												[key]: newValue,
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
			<div className="flex border-1 rounded-md overflow-clip">
				<Table
					className={`white-space-nowrap w-full compact-table border-collapse grid-table`}
				>
					<TableHeader>
						<TableRow>
							<TableHead>部位</TableHead>
							<TableHead>アイテム</TableHead>
							{/* ダメージはここに置くとやりにくい（左なのか右なのかわからないので） 基礎の方に入力してもらう */}
							{/* <TableHead className="text-center">ダメージ</TableHead> */}
							{effectSubjects.map((subject) => (
								<TableHead key={subject} className="text-center">
									{subject.replace(/属性/, "")}
								</TableHead>
							))}
							<TableHead className="text-center">バフ</TableHead>
							<TableHead className="text-center">詳細</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>基礎</TableCell>
							<TableCell />
							{/* <TableCell /> */}
							{effectSubjects.map((subject) => (
								<TableCell key={subject} className="text-center">
									{
										baseStatus[
											subject.startsWith("耐")
												? "抵抗"
												: (subject as keyof typeof baseStatus)
										]
									}
								</TableCell>
							))}
							<TableCell />
							<TableCell />
						</TableRow>
						{WEAPON_PARTS.map((part) => {
							const item = itemOfParts.find(
								(item) =>
									item.type === EQUIPMENT_TYPE.weapons &&
									item.part === part.value,
							)?.item;
							return (
								<TableRow key={part.value}>
									<TableCell>{part.value}</TableCell>
									<ItemCells item={item} effectSubjects={effectSubjects} />
								</TableRow>
							);
						})}
						{DEFENCE_PARTS.map((part) => {
							const item = itemOfParts.find(
								(item) =>
									item.type === EQUIPMENT_TYPE.defences &&
									item.part === part.value,
							)?.item;

							return (
								<TableRow key={part.value}>
									<TableCell>{part.value}</TableCell>
									<ItemCells item={item} effectSubjects={effectSubjects} />
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell>合計</TableCell>
							<SumCells
								baseStatus={baseStatus}
								itemOfParts={itemOfParts}
								effectSubjects={effectSubjects}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
			<p>
				合計の計算は表の上から下の順に行われます。並び替えや順番入力機能を実装予定です。
			</p>
		</div>
	);
}
