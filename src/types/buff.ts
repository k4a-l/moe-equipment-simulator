import z from "zod";
import {
	ALL_SKILLS,
	effectSubjectSchema,
	MANUFACTURE_PROCESS,
	MANUFACTURE_SKILLS,
} from "./Item";

// ------------------ バフ ------------------ //
const statusUpBuffSchema = z.object({
	type: z.literal("statusUp"), // 効果の種類
	subject: effectSubjectSchema, // 効果対象
	value: z.number(), // 効果値
	method: z.union([z.literal("add"), z.literal("multiply")]),
	group: z.string().optional(), // グループ番号（同じグループのバフは同時に適用されない） 今はどことも被ってないけど今後の実装で被るということもあるのが面倒 その時に既存のデータを更新できるか？
});

type StatusUpBuff = z.infer<typeof statusUpBuffSchema>;

// 全バフを体系化するのは大変なので文字列だけでも格納できれば後々なんとかなるだろうと...
const otherBuffSchema = z.object({
	type: z.literal("others"), // バフの種類
	subject: z.string(), // バフの説明
});
type OtherBuff = z.infer<typeof otherBuffSchema>;

const transformBuffSchema = z.object({
	type: z.literal("transform"), // 変身バフ
	subject: z.string(), // 変身対象の名前
	description: z.string().optional(), // 変身の説明
});

const standMotionChangeBuff = z.object({
	type: z.literal("standMotionChange"),
	description: z.string().optional(),
});

const moveMotionChangeBuff = z.object({
	type: z.literal("moveMotionChange"),
	description: z.string().optional(),
});

const recoveryBuff = z.object({
	type: z.literal("recovery"),
	subject: z.union([z.literal("MP"), z.literal("HP"), z.literal("SP")]),
	value: z.number(),
	probability: z.number(),
});

const costRatioBuff = z.object({
	type: z.literal("costRatio"),
	subject: z.union([z.literal("MP"), z.literal("HP"), z.literal("SP")]),
	value: z.number(),
});

const delayCutBuff = z.object({
	type: z.literal("delayCut"),
	subject: z.union(ALL_SKILLS),
	value: z.number(),
});

const manufactureBuff = z.object({
	type: z.literal("manufacture"),
	subject: z.union([...MANUFACTURE_SKILLS, z.literal("全生産" as const)]),
	process: z.union(MANUFACTURE_PROCESS),
	value: z.number(),
});

const techniqueBuff = z.object({
	type: z.literal("technique"),
	subject: z.string(), // 技能名
});
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
				statusUpBuffSchema,
				otherBuffSchema,
				transformBuffSchema,
				standMotionChangeBuff,
				moveMotionChangeBuff,
				recoveryBuff,
				costRatioBuff,
				delayCutBuff,
				manufactureBuff,
				techniqueBuff,
			]),
		),
	}),
]);

export type Buff = z.infer<typeof buffSchema>;
