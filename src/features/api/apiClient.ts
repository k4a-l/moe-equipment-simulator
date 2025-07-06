import { $fc } from "/src/app/api/frourio.client";

// High-Level Client インスタンスを作成
export const apiClient = $fc({
	// 必要に応じてオプションを指定
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api", // APIのベースURL
});

// Low-Level Client が必要な場合は同様に作成
// import { fc } from '../app/frourio.client';
// export const lowLevelApiClient = fc({ ... });
