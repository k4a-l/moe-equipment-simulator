export const strictKeys = <T extends { [key: string]: unknown }>(
	obj: T,
): (keyof T)[] => {
	return Object.keys(obj);
};

export const strictEntries = <T extends { [key: string]: unknown }>(
	obj: T,
): [keyof T, T[keyof T]][] => {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export const strictFromEntries = <T extends { [key: string]: unknown }>(
	entries: [keyof T, T[keyof T]][],
): T => {
	return Object.fromEntries(entries) as T;
};
