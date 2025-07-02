import z from "zod";
import { effectSubjectSchema } from "./Item";

// ------------------ バフ ------------------ //
const statusUpBuffSchema = z.object({
	type: z.literal("statusUp"), // 効果の種類
	subject: effectSubjectSchema, // 効果対象
	value: z.number(), // 効果値
	method: z.union([z.literal("add"), z.literal("multiply")]), //
	// 効果の適用方法
});

type StatusUpBuff = z.infer<typeof statusUpBuffSchema>;

// 全バフを体系化するのは大変なので文字列だけでも格納できれば後々なんとかなるだろうと...
const otherBuffSchema = z.object({
	type: z.literal("others"), // バフの種類
	subject: z.string(), // バフの説明
});
type OtherBuff = z.infer<typeof otherBuffSchema>;

export const buffSchema = z.union([
	z.object({
		name: z.string(),
		description: z.string(),
		unedited: z.literal(true),
		effects: z.array(z.never()).optional(),
	}),
	z.object({
		name: z.string(),
		description: z.string(),
		unedited: z.literal(false).optional(),
		effects: z.array(
			z.union([
				statusUpBuffSchema, // ステータスアップ系のバフ
				otherBuffSchema, // その他のバフ
			]),
		),
	}),
]);

export type Buff = z.infer<typeof buffSchema>;
