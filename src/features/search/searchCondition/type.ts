import { object, z } from "zod";
import { effectSubjectSchema } from "@/types/effect";
import { strictKeys } from "@/utils/objects";

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
		subject: z.string({ required_error: "" }),
		minValue: z.number().optional(),
		maxValue: z.number().optional(),
		valueType: z.enum(["add", "multiply"]),
	})
	.superRefine((args, ctx) => {
		const { minValue, maxValue, subject, valueType, uuid } = args;

		if (
			(minValue || subject || maxValue || valueType) &&
			subject === undefined
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "対象ステータスが未指定です",
			});
		}

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
	});

export const sortStrategies = { asc: "低い順", desc: "高い順" } as const;

export const SortSchema = object({
	by: effectSubjectSchema.optional(),
	strategy: z.enum(strictKeys(sortStrategies) as [keyof typeof sortStrategies]),
	isPercentNumber: z.boolean().optional(),
});

export const searchConditionQuerySchema = z.object({
	partsConditions: z.array(z.string()),
	omitWords: z.string().optional(),
	sort: SortSchema.optional(),
	searchConditions: searchConditionsSchema,
});

export const searchConditionQuerySchemaWithPage =
	searchConditionQuerySchema.extend({
		pageIndex: z.number(),
	});
