import type { FrourioClientOption } from "@frourio/next";
import type { z } from "zod";
import { frourioSpec as frourioSpec_1dpu1by } from "./frourio";
import { frourioSpec as frourioSpec_1fo1jm1 } from "./search/condition/frourio";
import { frourioSpec as frourioSpec_11ohl7p } from "./search/result/frourio";

export const fc = (option?: FrourioClientOption) => ({
	"search/condition": {
		$url: $url_1fo1jm1(option),
		$build(req?: { init?: RequestInit }): [
			key: {
				lowLevel: true;
				baseURL: FrourioClientOption["baseURL"];
				dir: string;
			},
			fetcher: () => Promise<
				NonNullable<
					Awaited<ReturnType<ReturnType<typeof methods_1fo1jm1>["$get"]>>
				>
			>,
		] {
			return [
				{
					lowLevel: true,
					baseURL: option?.baseURL,
					dir: "D:/Data/Develop/software/moe-equipment-simulator/src/app/api/search/condition",
				},
				() => methods_1fo1jm1(option).$get(req),
			];
		},
		...methods_1fo1jm1(option),
	},
	"search/result": {
		$url: $url_11ohl7p(option),
		...methods_11ohl7p(option),
	},
	$url: $url_1dpu1by(option),
	$build(req?: { init?: RequestInit }): [
		key: {
			lowLevel: true;
			baseURL: FrourioClientOption["baseURL"];
			dir: string;
		},
		fetcher: () => Promise<
			NonNullable<
				Awaited<ReturnType<ReturnType<typeof methods_1dpu1by>["$get"]>>
			>
		>,
	] {
		return [
			{
				lowLevel: true,
				baseURL: option?.baseURL,
				dir: "D:/Data/Develop/software/moe-equipment-simulator/src/app/api",
			},
			() => methods_1dpu1by(option).$get(req),
		];
	},
	...methods_1dpu1by(option),
});

export const $fc = (option?: FrourioClientOption) => ({
	"search/condition": {
		$url: {
			get(): string {
				const result = $url_1fo1jm1(option).get();

				if (!result.isValid) throw result.reason;

				return result.data;
			},
		},
		$build(req?: { init?: RequestInit }): [
			key: {
				lowLevel: false;
				baseURL: FrourioClientOption["baseURL"];
				dir: string;
			},
			fetcher: () => Promise<
				z.infer<(typeof frourioSpec_1fo1jm1.get.res)[200]["body"]>
			>,
		] {
			return [
				{
					lowLevel: false,
					baseURL: option?.baseURL,
					dir: "D:/Data/Develop/software/moe-equipment-simulator/src/app/api/search/condition",
				},
				() => $fc(option)["search/condition"].$get(req),
			];
		},
		async $get(
			req?: Parameters<ReturnType<typeof methods_1fo1jm1>["$get"]>[0],
		): Promise<z.infer<(typeof frourioSpec_1fo1jm1.get.res)[200]["body"]>> {
			const result = await methods_1fo1jm1(option).$get(req);

			if (!result.isValid)
				throw result.isValid === false ? result.reason : result.error;

			return result.data.body;
		},
	},
	"search/result": {
		$url: {
			post(): string {
				const result = $url_11ohl7p(option).post();

				if (!result.isValid) throw result.reason;

				return result.data;
			},
		},
		async $post(
			req: Parameters<ReturnType<typeof methods_11ohl7p>["$post"]>[0],
		): Promise<z.infer<(typeof frourioSpec_11ohl7p.post.res)[200]["body"]>> {
			const result = await methods_11ohl7p(option).$post(req);

			if (!result.isValid)
				throw result.isValid === false ? result.reason : result.error;

			return result.data.body;
		},
	},
	$url: {
		get(): string {
			const result = $url_1dpu1by(option).get();

			if (!result.isValid) throw result.reason;

			return result.data;
		},
	},
	$build(req?: { init?: RequestInit }): [
		key: {
			lowLevel: false;
			baseURL: FrourioClientOption["baseURL"];
			dir: string;
		},
		fetcher: () => Promise<Response>,
	] {
		return [
			{
				lowLevel: false,
				baseURL: option?.baseURL,
				dir: "D:/Data/Develop/software/moe-equipment-simulator/src/app/api",
			},
			() => $fc(option).$get(req),
		];
	},
	async $get(
		req?: Parameters<ReturnType<typeof methods_1dpu1by>["$get"]>[0],
	): Promise<Response> {
		const result = await methods_1dpu1by(option).$get(req);

		if (!result.isValid)
			throw result.isValid === false ? result.reason : result.error;

		if (!result.ok) throw new Error(`HTTP Error: ${result.failure.status}`);

		return result.data;
	},
});

export const fc_1dpu1by = fc;

export const $fc_1dpu1by = $fc;

const $url_1dpu1by = (option?: FrourioClientOption) => ({
	get():
		| { isValid: true; data: string; reason?: undefined }
		| { isValid: false; data?: undefined; reason: z.ZodError } {
		return {
			isValid: true,
			data: `${option?.baseURL?.replace(/\/$/, "") ?? ""}D:/Data/Develop/software/moe-equipment-simulator/src/app/api`,
		};
	},
});

const $url_1fo1jm1 = (option?: FrourioClientOption) => ({
	get():
		| { isValid: true; data: string; reason?: undefined }
		| { isValid: false; data?: undefined; reason: z.ZodError } {
		return {
			isValid: true,
			data: `${option?.baseURL?.replace(/\/$/, "") ?? ""}D:/Data/Develop/software/moe-equipment-simulator/src/app/api/search/condition`,
		};
	},
});

const $url_11ohl7p = (option?: FrourioClientOption) => ({
	post():
		| { isValid: true; data: string; reason?: undefined }
		| { isValid: false; data?: undefined; reason: z.ZodError } {
		return {
			isValid: true,
			data: `${option?.baseURL?.replace(/\/$/, "") ?? ""}D:/Data/Develop/software/moe-equipment-simulator/src/app/api/search/result`,
		};
	},
});

const methods_1dpu1by = (option?: FrourioClientOption) => ({
	async $get(req?: { init?: RequestInit }): Promise<
		| {
				ok: true;
				isValid: true;
				data: Response;
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error?: undefined;
		  }
		| {
				ok: false;
				isValid: true;
				data?: undefined;
				failure: Response;
				raw: Response;
				reason?: undefined;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error: unknown;
		  }
		| {
				ok?: undefined;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok?: undefined;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason?: undefined;
				error: unknown;
		  }
	> {
		const url = $url_1dpu1by(option).get();

		if (url.reason) return url;

		const fetchFn = option?.fetch ?? fetch;
		const result:
			| { success: true; res: Response }
			| { success: false; error: unknown } = await fetchFn(url.data, {
			method: "GET",
			...option?.init,
			...req?.init,
			headers: { ...option?.init?.headers, ...req?.init?.headers },
		})
			.then((res) => ({ success: true, res }) as const)
			.catch((error) => ({ success: false, error }));

		if (!result.success) return { error: result.error };

		return result.res.ok
			? { ok: true, isValid: true, data: result.res, raw: result.res }
			: { ok: false, isValid: true, failure: result.res, raw: result.res };
	},
});

const methods_1fo1jm1 = (option?: FrourioClientOption) => ({
	async $get(req?: { init?: RequestInit }): Promise<
		| {
				ok: true;
				isValid: true;
				data: {
					status: 200;
					headers?: undefined;
					body: z.infer<(typeof frourioSpec_1fo1jm1.get.res)[200]["body"]>;
				};
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error: unknown;
		  }
		| {
				ok?: undefined;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok?: undefined;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason?: undefined;
				error: unknown;
		  }
	> {
		const url = $url_1fo1jm1(option).get();

		if (url.reason) return url;

		const fetchFn = option?.fetch ?? fetch;
		const result:
			| { success: true; res: Response }
			| { success: false; error: unknown } = await fetchFn(url.data, {
			method: "GET",
			...option?.init,
			...req?.init,
			headers: { ...option?.init?.headers, ...req?.init?.headers },
		})
			.then((res) => ({ success: true, res }) as const)
			.catch((error) => ({ success: false, error }));

		if (!result.success) return { error: result.error };

		switch (result.res.status) {
			case 200: {
				const resBody:
					| { success: true; data: unknown }
					| { success: false; error: unknown } = await result.res
					.json()
					.then((data) => ({ success: true, data }) as const)
					.catch((error) => ({ success: false, error }));

				if (!resBody.success)
					return { ok: true, raw: result.res, error: resBody.error };

				const body = frourioSpec_1fo1jm1.get.res[200].body.safeParse(
					resBody.data,
				);

				if (!body.success)
					return {
						ok: true,
						isValid: false,
						raw: result.res,
						reason: body.error,
					};

				return {
					ok: true,
					isValid: true,
					data: { status: 200, body: body.data },
					raw: result.res,
				};
			}
			default:
				return {
					ok: result.res.ok,
					raw: result.res,
					error: new Error(`Unknown status: ${result.res.status}`),
				};
		}
	},
});

const methods_11ohl7p = (option?: FrourioClientOption) => ({
	async $post(req: {
		body: z.infer<typeof frourioSpec_11ohl7p.post.body>;
		init?: RequestInit;
	}): Promise<
		| {
				ok: true;
				isValid: true;
				data: {
					status: 200;
					headers?: undefined;
					body: z.infer<(typeof frourioSpec_11ohl7p.post.res)[200]["body"]>;
				};
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok: boolean;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw: Response;
				reason?: undefined;
				error: unknown;
		  }
		| {
				ok?: undefined;
				isValid: false;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason: z.ZodError;
				error?: undefined;
		  }
		| {
				ok?: undefined;
				isValid?: undefined;
				data?: undefined;
				failure?: undefined;
				raw?: undefined;
				reason?: undefined;
				error: unknown;
		  }
	> {
		const url = $url_11ohl7p(option).post();

		if (url.reason) return url;

		const parsedBody = frourioSpec_11ohl7p.post.body.safeParse(req.body);

		if (!parsedBody.success)
			return { isValid: false, reason: parsedBody.error };

		const fetchFn = option?.fetch ?? fetch;
		const result:
			| { success: true; res: Response }
			| { success: false; error: unknown } = await fetchFn(url.data, {
			method: "POST",
			...option?.init,
			body: JSON.stringify(parsedBody.data),
			...req.init,
			headers: {
				...option?.init?.headers,
				"content-type": "application/json",
				...req.init?.headers,
			},
		})
			.then((res) => ({ success: true, res }) as const)
			.catch((error) => ({ success: false, error }));

		if (!result.success) return { error: result.error };

		switch (result.res.status) {
			case 200: {
				const resBody:
					| { success: true; data: unknown }
					| { success: false; error: unknown } = await result.res
					.json()
					.then((data) => ({ success: true, data }) as const)
					.catch((error) => ({ success: false, error }));

				if (!resBody.success)
					return { ok: true, raw: result.res, error: resBody.error };

				const body = frourioSpec_11ohl7p.post.res[200].body.safeParse(
					resBody.data,
				);

				if (!body.success)
					return {
						ok: true,
						isValid: false,
						raw: result.res,
						reason: body.error,
					};

				return {
					ok: true,
					isValid: true,
					data: { status: 200, body: body.data },
					raw: result.res,
				};
			}
			default:
				return {
					ok: result.res.ok,
					raw: result.res,
					error: new Error(`Unknown status: ${result.res.status}`),
				};
		}
	},
});
