import type { CellContext } from "@tanstack/react-table";
import type { HTMLProps } from "react";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> {
		getCellContext: (
			context: CellContext<TData, TValue>,
		) => HTMLProps<HTMLTableCellElement>;
	}
}
