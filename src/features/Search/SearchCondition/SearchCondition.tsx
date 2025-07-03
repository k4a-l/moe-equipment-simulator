import { produce } from "immer";
import { memo, type SetStateAction, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type SearchConditionType, searchConditionSchema } from "./type";

export const SearchCondition = memo(
	({
		needsValidation,
		condition,
		setCondition,
		effectsSubjects,
		deleteFunc,
	}: {
		needsValidation: boolean;
		condition: SearchConditionType;
		setCondition: (
			id: string,
			newCondition: SetStateAction<SearchConditionType>,
		) => void;
		effectsSubjects: string[];
		deleteFunc: (id: string) => void;
	}) => {
		const [_open, _setOpen] = useState(false);

		const conditionParseResult = useMemo(() => {
			return searchConditionSchema.safeParse(condition);
		}, [condition]);

		return (
			<div className="flex flex-col">
				{needsValidation && conditionParseResult.error && (
					<div className="text-red-500">
						{conditionParseResult.error.issues.map((issue) => (
							<div key={issue.path.join(".")}>{issue.message}</div>
						))}
					</div>
				)}

				<div className="flex items-center gap-2 ">
					<ReactSelect
						menuPlacement="auto"
						menuPosition="fixed"
						options={effectsSubjects.map((subject) => ({
							value: subject,
							label: subject,
						}))}
						className="w-full"
						styles={{
							control(base) {
								return {
									...base,
									// 折り返さない
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									overflow: "hidden",
									cursor: "pointer",
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
						placeholder="対象ステータス"
						components={{
							IndicatorSeparator: () => null,
						}}
						value={{ label: condition.subject, value: condition.subject }}
						onChange={(v) => {
							setCondition(condition.uuid, (prev) => ({
								...prev,
								subject: v?.value ?? undefined,
							}));
						}}
					/>
					<Input
						type="number"
						className="w-25"
						value={condition.minValue}
						onChange={(e) => {
							const value = Number(e.target.value);
							setCondition(condition.uuid, (prev) =>
								produce(prev, (draft) => {
									draft.minValue = Number.isNaN(value) ? undefined : value;
								}),
							);
						}}
					></Input>
					<p>～</p>
					<Input
						type="number"
						className="w-25"
						value={condition.maxValue}
						onChange={(e) => {
							const value = Number(e.target.value);
							setCondition(condition.uuid, (prev) =>
								produce(prev, (draft) => {
									draft.maxValue = Number.isNaN(value) ? undefined : value;
								}),
							);
						}}
					></Input>
					<Select
						value={condition.valueType}
						onValueChange={(v) => {
							setCondition(condition.uuid, (prev) =>
								produce(prev, (draft) => {
									draft.valueType = v as SearchConditionType["valueType"];
								}),
							);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="タイプ" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="add">実数</SelectItem>
							<SelectItem value="multiply">倍率</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						onClick={() => deleteFunc(condition.uuid)}
					>
						削除
					</Button>
				</div>
			</div>
		);
	},
);
