import { $fc } from "/src/app/api/frourio.client";

// もっと良い書き方あるはず

// ビルド時は正しく当てはめられているが、それが埋め込まれるわけじゃなさそう？next.config.js で環境変数を埋め込む必要がある？
export const baseUrl =
	process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: process.env.NEXT_PUBLIC_VERCEL_URL
			? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
			: "http://localhost:3000";

export const apiUrl = `${baseUrl}/api`;

// console.log(process.env, baseUrl);
// High-Level Client インスタンスを作成

export const apiClient = $fc({
	// 必要に応じてオプションを指定
	baseURL: baseUrl,
});

// Low-Level Client が必要な場合は同様に作成
// import { fc } from '../app/frourio.client';
// export const lowLevelApiClient = fc({ ... });
