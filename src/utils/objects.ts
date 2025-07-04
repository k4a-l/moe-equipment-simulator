export const strictKeys = <T extends { [key: string]: unknown }>(
	obj: T,
): (keyof T)[] => {
	return Object.keys(obj);
};
