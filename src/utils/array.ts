export const range = (from: number, to: number) =>
	[...Array(to - from + 1)].map((_, i) => from + i);
