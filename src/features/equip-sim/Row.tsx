import type { CellContext } from "@tanstack/react-table";
import { produce } from "immer";
import { BookTextIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { InjectBuff, Item } from "@/types/Item";
import type { Data } from "./EquipSimByCharacter";
import type { ItemOfPart } from "./type";

export function ItemDetail({ item }: { item: InjectBuff<Item> }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"ghost"}>
					<BookTextIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-10/12 min-h-0 overflow-y-auto max-w-7xl! ">
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

export const GroupInput = memo(
	({
		info,
		setItemOfParts,
	}: {
		info: CellContext<Data, unknown>;
		setItemOfParts: React.Dispatch<React.SetStateAction<ItemOfPart[]>>;
	}) => {
		const original = info.row.original;
		if (original.type === "base") {
			return null;
		}
		if (original.type === "total") {
			return original.group;
		}

		return (
			<Input
				type="number"
				min={0}
				value={original.group}
				onChange={(e) => {
					const value =
						e.target.value === "" ? undefined : Number(e.target.value);

					setItemOfParts((prev) => {
						return produce(prev, (draft) => {
							const targetIndex = draft.findIndex(
								(part) => part.part === original.部位,
							);
							if (targetIndex === -1) return;
							const target = draft[targetIndex];
							if (!target) return;

							target.items = target.items.map((item) => {
								if (item.rowId !== original.rowId) return item;
								return {
									...item,
									group: value,
								};
							});
						});
					});
				}}
				className="rounded-sm min-w-16"
			/>
		);
	},
);
