import { ArrowUp10Icon, PercentIcon, PlusIcon } from "lucide-react";
import type { EffectSubjectType } from "moe-equipment-assets/types/effect";
import { DEFENCE_PARTS, WEAPON_PARTS } from "moe-equipment-assets/types/item";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import { useSessionStorage } from "usehooks-ts";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomReactSelect } from "@/components/ui/reactSelect";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { setStateAction } from "@/lib/hooks";
import { strictEntries } from "@/lib/objects";
import { SearchCondition } from "./SearchCondition";
import {
	type SearchConditionType,
	type SortSchema,
	type searchConditionQuerySchema,
	searchConditionsSchema,
	sortStrategies,
} from "./type";

export const createSearchConditionKey = (key: string) =>
	`search-condition-${key}`;

export const SearchConditionContainer = ({
	conditions,
	setConditions,
	effectsSubjects,
	execSearch,
	staticPart,
}: {
	conditions: SearchConditionType[];
	setConditions: Dispatch<SetStateAction<SearchConditionType[]>>;
	effectsSubjects: EffectSubjectType[];
	execSearch: (query: z.infer<typeof searchConditionQuerySchema>) => void;
	staticPart?: string;
}) => {
	const [partsConditions, setPartsConditions] = useState<string[]>(
		staticPart ? [staticPart] : [],
	);
	const [omitWords, setOmitWords] = useSessionStorage<string>(
		createSearchConditionKey("omitWords"),
		"",
	);
	const [includesWords, setIncludesWords] = useSessionStorage<string>(
		createSearchConditionKey("includesWords"),
		"",
	);
	const [sort, setSort] = useSessionStorage<z.infer<typeof SortSchema>>(
		createSearchConditionKey("sort"),
		{
			strategy: "desc",
		},
	);

	const deleteSearchCondition = useCallback(
		(uuid: string) => {
			setConditions((prev) =>
				prev.filter((condition) => condition.uuid !== uuid),
			);
		},
		[setConditions],
	);

	const setCondition = useCallback(
		(id: string, newCondition: SetStateAction<SearchConditionType>) => {
			setConditions((prev) =>
				prev.map((c) => (c.uuid === id ? setStateAction(newCondition, c) : c)),
			);
		},
		[setConditions],
	);

	const [needsValidation, setNeedsValidation] = useState(false);
	const validationResult = useMemo(
		() => searchConditionsSchema.safeParse(conditions.filter((c) => c.subject)),
		[conditions],
	);

	const onClickSearch = useCallback(() => {
		if (!validationResult.success) {
			console.log("バリデーションエラー:", validationResult.error);
			setNeedsValidation(true);
			return;
		}
		setNeedsValidation(false);
		execSearch({
			partsConditions: partsConditions,
			omitWords,
			includesWords,
			searchConditions: validationResult.data,
			sort,
		});
	}, [
		execSearch,
		validationResult,
		partsConditions,
		omitWords,
		sort,
		includesWords,
	]);

	return (
		<div className="flex flex-col gap-4">
			{needsValidation && validationResult.error && (
				<p className="text-red-500">
					{validationResult.error.issues
						.filter((issue) => !issue.path.length)
						.map((issue) => (
							<span key={issue.path.join(".")}>
								{issue.message}
								<br />
							</span>
						))}
				</p>
			)}
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 items-stretch justify-between">
					<p>部位選択</p>
					<Button
						variant={"outline"}
						size="sm"
						className="text-xs shadow-none h-auto flex"
						onClick={() =>
							setPartsConditions(
								[WEAPON_PARTS, DEFENCE_PARTS].flat().map((part) => part.value),
							)
						}
					>
						全選択
					</Button>
				</div>
				<CustomReactSelect
					isDisabled={!!staticPart}
					options={[WEAPON_PARTS, DEFENCE_PARTS].flat().map((part) => ({
						value: part.value,
						label: part.value,
					}))}
					value={partsConditions.map((part) => ({
						value: part,
						label: part,
					}))}
					onChange={(selected) => {
						setPartsConditions(selected.map((s) => s.value));
					}}
					isMulti
					closeMenuOnSelect={false}
				/>
				<div className="w-2"></div>
			</div>
			<div className="flex flex-col gap-2">
				<p>包含語句</p>
				<div className="flex items-stretch ">
					<Input
						placeholder="名前、説明、特殊条件などをカンマ区切り"
						value={includesWords}
						onChange={(e) => setIncludesWords(e.target.value)}
						className="rounded-l-none shadow-none bg-white"
					></Input>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<p>除外語句</p>
				<div className="flex items-stretch ">
					<Input
						placeholder="名前、説明、特殊条件などをカンマ区切り"
						value={omitWords}
						onChange={(e) => setOmitWords(e.target.value)}
						className="rounded-l-none shadow-none bg-white"
					></Input>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<p>ステータス</p>
				<div className="p-2 border rounded-md flex flex-col gap-2">
					<div className="flex content-stretch gap-2">
						<div className="flex items-stretch grow">
							<div className="px-3 py-0.5 bg-white flex items-center rounded-l-sm border border-r-0">
								<p className="whitespace-nowrap">表示順</p>
							</div>
							<CustomReactSelect
								options={effectsSubjects.map((e) => ({
									value: e,
									label: e,
								}))}
								value={
									sort?.by ? { value: sort.by, label: sort.by } : undefined
								}
								onChange={(selected) => {
									setSort((prev) => {
										return {
											by: selected?.value ?? undefined,
											strategy: prev?.strategy ?? "desc",
										};
									});
								}}
								styles={{
									control: () => ({
										borderRadius: 0,
									}),
								}}
								isClearable
							/>

							<ToggleGroup
								type="single"
								value={sort.isPercentNumber ? "true" : "false"}
								onValueChange={(value) => {
									setSort((prev) => ({
										...prev,
										isPercentNumber: value === "true",
									}));
								}}
								variant={"outline"}
								className="flex"
							>
								<ToggleGroupItem
									value="false"
									className="rounded-none! border-l-0!"
								>
									<ArrowUp10Icon />
								</ToggleGroupItem>
								<ToggleGroupItem value="true" className="rounded-none!">
									<PercentIcon />
								</ToggleGroupItem>
							</ToggleGroup>
						</div>

						<CustomReactSelect
							options={strictEntries(sortStrategies).map(([value, label]) => ({
								value,
								label,
							}))}
							value={
								sort
									? {
											value: sort?.strategy,
											label: sortStrategies[sort?.strategy],
										}
									: undefined
							}
							onChange={(selected) => {
								setSort((prev) => {
									return {
										...prev,
										strategy: selected?.value ?? "desc",
									};
								});
							}}
							className="w-auto"
						/>
					</div>
					{conditions.map((condition) => (
						<SearchCondition
							needsValidation={needsValidation}
							condition={condition}
							key={condition.uuid}
							effectsSubjects={effectsSubjects}
							setCondition={setCondition}
							deleteFunc={deleteSearchCondition}
						/>
					))}
					<Button
						variant={"ghost"}
						size={"sm"}
						onClick={() => {
							setConditions((prev) => [...prev, { uuid: crypto.randomUUID() }]);
						}}
					>
						<PlusIcon />
					</Button>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button onClick={onClickSearch}>検索</Button>
			</div>
		</div>
	);
};
