import { BookPlusIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell } from "@/components/ui/table";
import type { InjectBuff, Item } from "@/types/Item";
import type { ItemOfPart } from "./type";

export function ItemCells({
	item,
	effectSubjects,
}: {
	item: InjectBuff<Item> | undefined;
	effectSubjects: string[];
}) {
	if (!item) {
		return (
			<TableCell colSpan={effectSubjects.length + 3}>
				アイテムが選択されていません
			</TableCell>
		);
	}

	return (
		<>
			<TableCell className="flex justify-between items-center  sticky left-0">
				<Button variant="outline" className="w-full justify-start">
					<ListIcon />
					{item?.name}
				</Button>
			</TableCell>
			{effectSubjects.map((subject) => (
				<TableCell key={subject} className="text-center">
					{[
						item?.effects
							.filter((e) => e.subject === subject)
							?.map((e) => e.value),
						item?.buff?.effects?.map((e) =>
							e.type === "statusUp" && e.subject === subject
								? `${e.method === "add" ? "+" : "×"}${e.value} `
								: undefined,
						) ?? [],
					]
						.flat()
						.filter((e) => e !== undefined)
						.join(" / ")}
				</TableCell>
			))}
			<TableCell className="text-center">
				{item?.buff && (
					<Button variant={"outline"} className="w-full">
						{item?.buff?.name}
					</Button>
				)}
			</TableCell>
			<TableCell>
				<ItemDetail item={item} />
			</TableCell>
		</>
	);
}

function ItemDetail({ item }: { item: InjectBuff<Item> }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"}>
					<BookPlusIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-10/12 min-h-0 overflow-y-auto">
				<DialogHeader>
					<DialogTitle> {item.name}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2  min-h-0 overflow-x-hidden">
					<a
						href={`https://scrapbox.io/medianmoe/${item.name}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						Medi記録Scrapbox版
					</a>
					<a
						href={`https://idb.moepic.com/items/${item.type}/${item.id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:underline"
					>
						Master of Epic 公式データベース
					</a>
					{/* TODO: preはdialogをはみ出さないけど縮まった分スクロールしたい */}
					<pre className="min-w-0 max-w-full overflow-x-auto px-4 py-3.5 bg-gray-100 rounded-md shrink-1">
						<code>{JSON.stringify(item, null, 2)}</code>
					</pre>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function SumCells({
	baseStatus,
	effectSubjects,
	itemOfParts,
}: {
	baseStatus: Record<string, number>;
	effectSubjects: string[];
	itemOfParts: ItemOfPart[];
}) {
	return (
		<>
			{/* <TableCell /> */}
			<TableCell />
			{effectSubjects.map((subject) => (
				<TableCell key={subject} className="text-center">
					{itemOfParts
						.reduce(
							(acc, cur) => {
								const staticEffectValue = (cur.item?.effects ?? [])
									.filter((e) => e.subject === subject)
									.reduce((sum, e) => sum + e.value, 0);
								const staticBuffValue = (cur.item?.buff?.effects ?? [])
									.filter((e) => e.type === "statusUp")
									.filter((e) => e.subject === subject)
									.filter((e) => e.method === "add")
									?.reduce((sum, e) => sum + e.value, 0);
								const multiplyBuffValue =
									(cur.item?.buff?.effects ?? [])
										.filter((e) => e.type === "statusUp")
										.filter((e) => e.subject === subject)
										.filter((e) => e.method === "multiply")
										?.reduce((product, e) => product * e.value, 1) ?? 1;

								return (
									(acc + staticEffectValue + staticBuffValue) *
									multiplyBuffValue
								);
							},
							baseStatus[subject.startsWith("耐") ? "抵抗" : subject] ?? 0,
						)
						.toFixed(1)}
				</TableCell>
			))}
			{/* バフ */}
			<TableCell className="text-center">
				{itemOfParts.filter((i) => i.item?.buff).length} 個
			</TableCell>
			<TableCell />
		</>
	);
}
