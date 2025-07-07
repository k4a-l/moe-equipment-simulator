"use client";

import { produce } from "immer";
import { LoaderIcon, PlusIcon } from "lucide-react";
import type { ItemWithBuff } from "moe-equipment-assets/types/item";
import { type Dispatch, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { setStateAction, useSessionStorageWithValidation } from "@/utils/hooks";
import { createEquipSimKey, EquipSimByCharacter } from "./EquipSimByCharacter";
import {
	type Character,
	DEFAULT_BASE_STATUS,
	type ItemOfPart,
	type SavedCharacter,
	type SavedItemOfParts,
	savedCharacterSchema,
	type WithGroup,
} from "./type";
import { useItems } from "./useItems";

export function EquipSim() {
	const [savedCharacters, setSavedCharacters] = useSessionStorageWithValidation(
		createEquipSimKey("characters"),
		[],
		savedCharacterSchema.array(),
	);

	const [initialItemIds] = useState<number[]>(() => {
		return savedCharacters
			.flatMap((character) => character.parts)
			.flatMap((part) => part.items)
			.map((item) => item.id)
			.filter((id) => id !== undefined);
	});

	const initialItemsResponse = useItems({ itemIds: initialItemIds });

	if (initialItemsResponse.isFetching || initialItemsResponse.isLoading) {
		return <LoaderIcon className="animate-spin" />;
	}

	if (initialItemsResponse.error) {
		console.error("Failed to fetch initial items:", initialItemsResponse.error);
		return <div>Error loading items</div>;
	}

	if (!initialItemsResponse.data) {
		console.error("No items found in initial response");
		return <div>No items found</div>;
	}

	return (
		<ItemInject
			savedCharacters={savedCharacters}
			fetchedItems={initialItemsResponse.data}
			saveCharacters={setSavedCharacters}
		/>
	);
}

const injectItem = (
	saved: SavedItemOfParts[],
	fetched: ItemWithBuff[],
): ItemOfPart[] => {
	const parts: ItemOfPart[] = saved.map((part): ItemOfPart => {
		const items = part.items.flatMap((item): WithGroup<ItemWithBuff> | [] => {
			const realItem = fetched.find((i) => i.id === item.id);
			if (!realItem) return [];

			return { ...realItem, group: item.group };
		});

		return {
			...part,
			items: items.map((item) => {
				return {
					...item,
					rowId: crypto.randomUUID(),
				};
			}),
		} as ItemOfPart;
	});

	return parts;
};

const ItemInject = ({
	savedCharacters,
	fetchedItems,
	saveCharacters: saveCharacter,
}: {
	savedCharacters: SavedCharacter[];
	fetchedItems: ItemWithBuff[];
	saveCharacters: Dispatch<React.SetStateAction<SavedCharacter[]>>;
}) => {
	const [characters, _setCharacters] = useState<Character[]>(
		savedCharacters.length
			? savedCharacters.map((c) => ({
					id: c.id,
					name: c.name,
					parts: injectItem(c.parts, fetchedItems),
					baseStatuses: c.baseStatuses,
				}))
			: [
					{
						id: crypto.randomUUID(),
						name: "",
						parts: [],
						baseStatuses: DEFAULT_BASE_STATUS,
					},
				],
	);

	const setCharacters = useCallback<
		Dispatch<React.SetStateAction<Character[]>>
	>(
		(newCharacterAction) => {
			_setCharacters((prev) => {
				const newCharacters = setStateAction(newCharacterAction, prev);

				setTimeout(() => {
					saveCharacter((): SavedCharacter[] => {
						return newCharacters.map((c) => {
							const savedParts: SavedItemOfParts[] = c.parts.map((part) => ({
								...part,
								items: part.items.map((item) => ({
									id: item.id,
									group: item.group,
								})),
							}));
							return { ...c, parts: savedParts };
						});
					});
				}, 0);

				return newCharacters;
			});
		},
		[saveCharacter],
	);

	const [selectedCharacterId, setSelectedCharacterId] = useState<
		string | undefined
	>(characters[0]?.id);

	const selectedCharacter = useMemo(() => {
		return characters.find((c) => c.id === selectedCharacterId);
	}, [characters, selectedCharacterId]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 justify-between">
				<Select
					value={selectedCharacter?.id ?? ""}
					onValueChange={(value) => {
						if (value === "") {
							setSelectedCharacterId(undefined);
						} else {
							const character = characters.find((c) => c.id === value);
							setSelectedCharacterId(character?.id);
						}
					}}
				>
					<SelectTrigger className="min-w-[180px]">
						<SelectValue placeholder="キャラクターを選択" />
					</SelectTrigger>
					<SelectContent>
						{characters.map((c) => (
							<SelectItem key={c.id} value={c.id}>
								{c.name || " - "}
							</SelectItem>
						))}
						<Button
							className="w-full mt-2"
							onClick={() => {
								const newCharacter: Character = {
									id: crypto.randomUUID(),
									name: "",
									parts: [],
									baseStatuses: DEFAULT_BASE_STATUS,
								};
								setCharacters((prev) => [...prev, newCharacter]);
								setSelectedCharacterId(newCharacter.id);
							}}
						>
							<PlusIcon /> 新規キャラクター
						</Button>
					</SelectContent>
				</Select>
				{selectedCharacter && (
					<div className="flex flex-col gap-4" key={selectedCharacter.id}>
						<div className="flex items-center gap-2">
							<Input
								type="text"
								value={selectedCharacter.name}
								onChange={(e) => {
									setCharacters((prev) => {
										return prev.map((pc) => {
											if (pc.id !== selectedCharacter.id) return pc;
											return { ...pc, name: e.target.value };
										});
									});
								}}
								placeholder="キャラクター名"
							/>
							<Button
								onClick={() => {
									if (!window.confirm("このキャラクターを削除しますか？"))
										return;
									setCharacters((prev) => {
										const newCharacters = prev.filter(
											(pc) => pc.id !== selectedCharacter.id,
										);
										setSelectedCharacterId(newCharacters[0]?.id);
										return newCharacters;
									});
								}}
							>
								削除
							</Button>
						</div>
					</div>
				)}
			</div>

			{selectedCharacter && (
				<EquipSimByCharacter
					baseStatuses={selectedCharacter.baseStatuses}
					setBaseStatuses={(newBaseStatusAction) => {
						setCharacters((prev) => {
							const result = prev.map((pc) => {
								if (pc.id !== selectedCharacter.id) return pc;
								return produce(pc, (draft) => {
									draft.baseStatuses = setStateAction(
										newBaseStatusAction,
										draft.baseStatuses,
									);
								});
							});
							return result;
						});
					}}
					itemOfParts={selectedCharacter.parts}
					setItemOfParts={(newPartsAction) => {
						setCharacters((prev) => {
							const result = prev.map((pc) => {
								if (pc.id !== selectedCharacter.id) return pc;
								return produce(pc, (draft) => {
									draft.parts = setStateAction(newPartsAction, draft.parts);
								});
							});
							return result;
						});
					}}
				/>
			)}
		</div>
	);
};
