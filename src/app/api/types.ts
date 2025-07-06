import type { NextResponse } from "next/server";

export type InferNextResponseType<T> = T extends (
	...args: any[]
) => Promise<NextResponse<infer U>>
	? U
	: never;
