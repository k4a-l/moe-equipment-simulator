import { object, z } from "zod";
import { effectSubjectSchema } from "@/types/effect";
import { strictKeys } from "@/utils/objects";

const searchConditionSchemaBase = z.object({
	uuid: z.string(),
	part: z.array(z.string()).optional(), // 部位
	subject: effectSubjectSchema.optional(), // 検索対象
	minValue: z.number().optional(), // 最小値
	maxValue: z.number().optional(), // 最大値
	numberType: z.enum(["percent"]).optional(), // 値タイプ
});

export type SearchConditionType = z.infer<typeof searchConditionSchemaBase>;

export const searchConditionSchema = searchConditionSchemaBase.superRefine(
	(args, ctx) => {
		const { minValue, maxValue, subject, uuid } = args;

		if ((minValue || subject || maxValue) && subject === undefined) {
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
	},
);

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
	omitWords: z.string(),
	includesWords: z.string(),
	sort: SortSchema.optional(),
	searchConditions: searchConditionsSchema,
});

export const searchConditionQuerySchemaWithPage =
	searchConditionQuerySchema.extend({
		pageIndex: z.number(),
	});
