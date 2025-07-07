import { produce } from "immer";
import type { EffectSubjectType } from "moe-equipment-assets/types/effect";
import { memo, type SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomReactSelect } from "@/components/ui/reactSelect";
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
		effectsSubjects: EffectSubjectType[];
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
					<CustomReactSelect
						options={effectsSubjects.map((subject) => ({
							value: subject,
							label: subject,
						}))}
						placeholder="対象ステータス"
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
						className="w-25 bg-white"
						value={condition.minValue ?? ""}
						onChange={(e) => {
							const value =
								e.target.value === "" ? undefined : Number(e.target.value);
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
						className="w-25 bg-white"
						value={condition.maxValue ?? ""}
						onChange={(e) => {
							const value =
								e.target.value === "" ? undefined : Number(e.target.value);
							setCondition(condition.uuid, (prev) =>
								produce(prev, (draft) => {
									draft.maxValue = Number.isNaN(value) ? undefined : value;
								}),
							);
						}}
					></Input>
					<Select
						value={condition.numberType ?? "static"}
						onValueChange={(v) => {
							setCondition(condition.uuid, (prev) =>
								produce(prev, (draft) => {
									draft.numberType = v === "percent" ? "percent" : undefined;
								}),
							);
						}}
					>
						<SelectTrigger className="bg-white">
							<SelectValue placeholder="タイプ" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="static">実数</SelectItem>
							<SelectItem value="percent">%</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => deleteFunc(condition.uuid)}
					>
						×
					</Button>
				</div>
			</div>
		);
	},
);
