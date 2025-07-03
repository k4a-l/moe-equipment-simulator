import { z } from "zod";

export type SearchConditionType = {
	uuid: string;
	part?: string[]; // 部位
	subject?: string; // 検索対象
	minValue?: number; // 最小値
	maxValue?: number; // 最大値
	valueType: "add" | "multiply"; // 値タイプ
};

export const searchConditionSchema = z
	.object({
		uuid: z.string(),
		subject: z.string({ required_error: "対象ステータスが未指定です" }),
		minValue: z.number().optional(),
		maxValue: z.number().optional(),
		valueType: z.enum(["add", "multiply"]),
	})
	.superRefine((args, ctx) => {
		const { minValue, maxValue, subject } = args;

		if (minValue === undefined && maxValue === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "最小値または最大値のいずれかを指定してください",
				path: ["minValue", "maxValue"],
			});
			return;
		}

		if (minValue === undefined) return;
		if (maxValue === undefined) return;
		if (minValue > maxValue) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "最小値は最大値より小さい値を指定してください",
				path: ["minValue", "maxValue"],
			});
		}
	});

export const searchConditionsSchema = z
	.array(searchConditionSchema)
	.superRefine((args, ctx) => {
		// 同じsubjectが複数ある場合はエラー
		const subjects = args.map((condition) => condition.subject).filter(Boolean);
		const uniqueSubjects = new Set(subjects);
		if (uniqueSubjects.size !== subjects.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "同じ対象ステータスが複数あります",
			});
		}

		// 条件が一つもない場合はエラー
		if (args.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "検索条件が一つもありません",
			});
		}
	});
