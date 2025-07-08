// カスタムfetch関数を作成して、HTTPエラーを自動的にthrowする
export const fetchWithErrorHandling = async (
	url: string,
	options?: RequestInit,
): Promise<Response> => {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response;
};

// JSONレスポンス用のヘルパー
export const fetchJson = async <T = unknown>(
	url: string,
	options?: RequestInit,
): Promise<T> => {
	const response = await fetchWithErrorHandling(url, options);
	return response.json();
};
