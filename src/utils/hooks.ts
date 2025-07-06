import type { SetStateAction } from "react";
import { useSessionStorage } from "usehooks-ts";
import type { z } from "zod";

export const setStateAction = <T>(value: SetStateAction<T>, prev: T): T => {
	if (typeof value === "function") {
		return (value as (prev: T) => T)(prev);
	}
	return value;
};

export const useSessionStorageWithValidation = <T>(
	key: string,
	initialValue: T,
	schema: z.ZodType<T>,
) => {
	const [storedValue, setStoredValue] = useSessionStorage(key, initialValue, {
		deserializer: (value) => {
			try {
				return schema.parse(JSON.parse(value));
			} catch (error) {
				console.error(
					`Error parsing session storage value for key "${key}":`,
					error,
				);
				return initialValue;
			}
		},
	});

	return [storedValue, setStoredValue] as const;
};
