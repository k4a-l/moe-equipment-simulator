import z from "zod";
import {
	ALL_SKILLS,
	type EFFECT_SUBJECTS,
	effectSubjectSchema,
	MANUFACTURE_PROCESS,
	MANUFACTURE_SKILLS,
} from "./Item";

// ------------------ バフ ------------------ //
const statusUpBuffSchema = z.object({
	type: z.literal("statusUp"), // 効果の種類
	subject: effectSubjectSchema, // 効果対象
	value: z.number(), // 効果値
	group: z.string().optional(), // グループ番号（同じグループのバフは同時に適用されない） 今はどことも被ってないけど今後の実装で被るということもあるのが面倒 その時に既存のデータを更新できるか？
	numberType: z.enum(["percent"]).optional(), // 効果値の単位
});

/**
 * ここで言う乗算は元ダメージへの乗算ではなく、バフ同士を加算するか乗算するかということ
 * - (元ダメージ)×（バフ1+バフ2）=最終ダメージなら加算
 * 対象によって計算方法固定されている？
 * - 例えばジャンプ力は全て乗算、攻撃力は全て加算など
 * - 攻撃力だけどこれだけは全体に乗算みたいなものはない？
 * - あった場合はそれを例外とすればいいのでは？
 * - 1個だけのために他100個にmethod:"add"を書くのは馬鹿のやることか
 * いや、違う 攻撃力増加バフでも+10系と+10%系があるので分けないといけない
 * それはそれで分ければいいだけな気がする？
 * subjectの名前ごとわけじゃったほうがいい？でもそれだと計算が面倒か
 * 実数と％にわけるとして、ディレイカットは実数なのか%なのか
 * 値が実数なのか係数なのかでわけられそう？
 * ゲーム内に単体の値として存在するか否かとか
 * - ディレイ：-43など実数として表される
 * - 攻撃力、ST、MPなど：ゲーム内でも実数 %のときは明記する
 * - 予ダメージアップ：係数
 * - 属性効果：予ダメージと同様
 * - スキル系：実数（今後割合が出てくるかもしれないが）
 * 係数しか存在しないものは「率」とつけちゃうのが安全かもしれない（ちょっと不自然でも）
 */
// TODO: 乗算のものはmultiplyにする
const STATUS_UP_CALC_METHODS = {
	攻撃力: "add",
	命中: "add",
	物理与ダメージ率: "add", // 確認済み
	魔法与ダメージ率: "add", // 確認済み
	魔法ディレイ: "add",
	クリティカル率: "add", // 確認済み
	魔力: "add",
	攻撃ディレイ: "add",
	最大HP: "add",
	最大MP: "add",
	最大ST: "add",
	防御力: "add",
	回避: "add",
	// ここからスキル系は全部加算
	素手: "add",
	刀剣: "add",
	こんぼう: "add",
	槍: "add",
	銃器: "add",
	弓: "add",
	盾: "add",
	投げ: "add",
	牙: "add",
	罠: "add",
	キック: "add",
	戦闘技術: "add",
	酩酊: "add",
	物まね: "add",
	調教: "add",
	破壊: "add",
	回復: "add",
	神秘: "add",
	召喚: "add",
	強化: "add",
	死魔: "add",
	魔法熟練: "add",
	自然調和: "add",
	暗黒命令: "add",
	取引: "add",
	シャウト: "add",
	音楽: "add",
	盗み: "add",
	ギャンブル: "add",
	パフォーマンス: "add",
	ダンス: "add",
	// ここまでスキル系は全部加算
	ペット経験値率: "multiply", // 確認済み
	火属性効果率: "add", // 確認済み
	水属性効果率: "add", // 確認済み
	土属性効果率: "add", // 確認済み
	風属性効果率: "add", // 確認済み
	無属性効果率: "add", // 確認済み
	HP自然回復: "add", //  確認済み
	ST自然回復: "add", // 確認済み
	MP自然回復: "add", // 確認済み
	移動速度: "add", // 確認済み
	水中速度: "add", // 確認済み
	耐全属性: "add",
	耐火属性: "add",
	耐水属性: "add",
	耐地属性: "add",
	耐風属性: "add",
	耐無属性: "add",
	SEEING: "add",
	HEARING: "add",
	SMELLING: "add",
	最大重量: "add",
	所持重量: "multiply", // 確認済み
	ジャンプ力率: "add",
	BREATH: "add",
	料理ゲージ滑り: "add",
	料理ゲージ速度: "add",
	料理ヒットゾーン: "add",
	料理グレードゾーン: "add",
	料理マスターグレードゾーン: "add",
	鍛冶ゲージ滑り: "add",
	鍛冶ゲージ速度: "add",
	鍛冶ヒットゾーン: "add",
	鍛冶グレードゾーン: "add",
	鍛冶マスターグレードゾーン: "add",
	醸造ゲージ滑り: "add",
	醸造ゲージ速度: "add",
	醸造ヒットゾーン: "add",
	醸造グレードゾーン: "add",
	醸造マスターグレードゾーン: "add",
	大工ゲージ滑り: "add",
	大工ゲージ速度: "add",
	大工ヒットゾーン: "add",
	大工グレードゾーン: "add",
	大工マスターグレードゾーン: "add",
	裁縫ゲージ滑り: "add",
	裁縫ゲージ速度: "add",
	裁縫ヒットゾーン: "add",
	裁縫グレードゾーン: "add",
	裁縫マスターグレードゾーン: "add",
	薬調合ゲージ滑り: "add",
	薬調合ゲージ速度: "add",
	薬調合ヒットゾーン: "add",
	薬調合グレードゾーン: "add",
	薬調合マスターグレードゾーン: "add",
	装飾細工ゲージ滑り: "add",
	装飾細工ゲージ速度: "add",
	装飾細工ヒットゾーン: "add",
	装飾細工グレードゾーン: "add",
	装飾細工マスターグレードゾーン: "add",
	複製ゲージ滑り: "add",
	複製ゲージ速度: "add",
	複製ヒットゾーン: "add",
	複製グレードゾーン: "add",
	複製マスターグレードゾーン: "add",
	栽培ゲージ滑り: "add",
	栽培ゲージ速度: "add",
	栽培ヒットゾーン: "add",
	栽培グレードゾーン: "add",
	栽培マスターグレードゾーン: "add",
	美容ゲージ滑り: "add",
	美容ゲージ速度: "add",
	美容ヒットゾーン: "add",
	美容グレードゾーン: "add",
	美容マスターグレードゾーン: "add",
	キック命中率補正: "add",
	キック攻撃力補正: "add",
	釣りゲージ速度: "add",
	釣りヒットゾーン: "add",
	釣りゲージ長: "add",
	泳ぎ速度: "add",
	牙命中率補正: "add",
	牙攻撃補正: "add",
	盗み補正: "add",
	潤喉度: "add",
	満腹度: "add",
	ピッキング失敗回数補正: "add",
	ピッキング回転速度補正: "add",
} satisfies Record<
	(typeof EFFECT_SUBJECTS)[number]["_type"],
	"add" | "multiply"
>;

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
