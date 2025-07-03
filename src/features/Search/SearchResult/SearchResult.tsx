"use client";

import {
	AllCommunityModule,
	type ColDef,
	ColumnAutoSizeModule,
	type GridOptions,
	ModuleRegistry,
	type RowSelectedEvent,
	type SelectionChangedEvent,
	themeQuartz,
} from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react"; // React Data Grid Component
import { useCallback, useMemo } from "react";

ModuleRegistry.registerModules([AllCommunityModule, ColumnAutoSizeModule]);

const myTheme = themeQuartz.withParams({
	columnBorder: { style: "dotted" },
});

const gridOptions: GridOptions = {
	autoSizeStrategy: {
		type: "fitCellContents",
		defaultMaxWidth: 250,
	},
	suppressMoveWhenColumnDragging: true,
	suppressMovableColumns: true,
	suppressColumnVirtualisation: true,
	theme: myTheme,
};

export function SearchResult({
	rows,
	cols,
}: {
	rows: unknown[];
	cols: ColDef[];
}) {
	const rowSelection = useMemo<AgGridReactProps["rowSelection"]>(() => {
		return {
			mode: "singleRow",
			enableClickSelection: true,
		};
	}, []);

	const onRowSelected = useCallback((event: RowSelectedEvent) => {
		console.log(
			"row " +
				event.node.data.athlete +
				" selected = " +
				event.node.isSelected(),
		);
	}, []);

	const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
		const rowCount = event.selectedNodes?.length;
	}, []);

	return (
		<div style={{ height: "800px" }}>
			<AgGridReact
				rowData={rows}
				columnDefs={cols}
				rowSelection={rowSelection}
				onRowSelected={onRowSelected}
				onSelectionChanged={onSelectionChanged}
				gridOptions={gridOptions}
				onColumnValueChanged={(grid) => {
					grid.api.autoSizeAllColumns();
				}}
			/>
		</div>
	);
}
