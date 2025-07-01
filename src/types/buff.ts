import z from "zod";

// ------------------ バフ ------------------ //
const statusUpSchema = z.object({
	type: z.literal("statusUp"), // 効果の種類
	object: z.string(), // 効果対象
	value: z.number(), // 効果値
	method: z.union([z.literal("add"), z.literal("multiply")]), //
	// 効果の適用方法
});

type StatusUp = z.infer<typeof statusUpSchema>;

// 全バフを体系化するのは大変なので文字列だけでも格納できれば後々なんとかなるだろうと...
const otherBuffSchema = z.object({
	type: z.string(), // バフの種類
	text: z.string(), // バフの説明
});
type Other = z.infer<typeof otherBuffSchema>;

export const buffSchema = z.object({
	name: z.string(),
	unedited: z.boolean().optional(), // バフが未編集かどうか
	effects: z.union([
		statusUpSchema, // ステータスアップ系のバフ
		otherBuffSchema, // その他のバフ
	]),
});
export type Buff = z.infer<typeof buffSchema>;
