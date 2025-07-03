import { PlusIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
	useState,
} from "react";
import ReactSelect from "react-select";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFENCE_PARTS, WEAPON_PARTS } from "@/types/Item";
import { setStateAction } from "@/utils/hooks";
import { SearchCondition } from "./SearchCondition";
import {
	type SearchConditionType,
	type searchConditionSchema,
	searchConditionsSchema,
} from "./type";

export const SearchConditionContainer = ({
	conditions,
	setConditions,
	effectsSubjects,
	execSearch,
}: {
	conditions: SearchConditionType[];
	setConditions: Dispatch<SetStateAction<SearchConditionType[]>>;
	effectsSubjects: string[];
	execSearch: (
		partConditions: string[],
		omitWords: string | undefined,
		searchConditions: z.infer<typeof searchConditionSchema>[],
	) => void;
}) => {
	const [partsConditions, setPartsConditions] = useState<string[]>([]);
	const [omitWords, setOmitWords] = useState<string>();

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
		() => searchConditionsSchema.safeParse(conditions),
		[conditions],
	);

	const onClickSearch = useCallback(() => {
		if (!validationResult.success) {
			console.log("バリデーションエラー:", validationResult.error);
			setNeedsValidation(true);
			return;
		}
		setNeedsValidation(false);
		execSearch(partsConditions, omitWords, validationResult.data);
	}, [execSearch, validationResult, partsConditions, omitWords]);

	return (
		<div className="flex flex-col gap-2">
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
			<div className="flex items-center gap-2">
				<ReactSelect
					menuPlacement="auto"
					menuPosition="fixed"
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
					className="w-full"
					styles={{
						control(base) {
							return {
								...base,
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
								overflow: "hidden",
								cursor: "pointer",
								width: "full",
								minWidth: "200px",
							};
						},
						option: (styles) => ({
							...styles,
							cursor: "pointer",
						}),
						menu: (base) => ({
							...base,
							width: "max-content",
							minWidth: "100%",
							height: "max-content",
						}),
						menuPortal: (base) => ({ ...base, zIndex: 9999 }),
					}}
					placeholder="部位"
					components={{
						IndicatorSeparator: () => null,
					}}
					isMulti
					closeMenuOnSelect={false}
				/>
				<Button onClick={onClickSearch}>検索</Button>
			</div>
			<Input
				placeholder="除外語句（カンマ区切り）（名前、説明、特殊条件）"
				value={omitWords}
				onChange={(e) => setOmitWords(e.target.value)}
			></Input>
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
				variant={"outline"}
				size={"sm"}
				onClick={() => {
					setConditions((prev) => [
						...prev,
						{
							uuid: crypto.randomUUID(),
							valueType: "add",
						},
					]);
				}}
			>
				<PlusIcon />
			</Button>
		</div>
	);
};
