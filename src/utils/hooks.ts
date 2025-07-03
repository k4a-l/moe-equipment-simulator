import type { SetStateAction } from "react";

export const setStateAction = <T>(value: SetStateAction<T>, prev: T): T => {
	if (typeof value === "function") {
		return (value as (prev: T) => T)(prev);
	}
	return value;
};
