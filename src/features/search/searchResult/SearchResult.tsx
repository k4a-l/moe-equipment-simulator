"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type PaginationState,
	type TableOptions,
	useReactTable,
} from "@tanstack/react-table";
import {
	AllCommunityModule,
	ColumnAutoSizeModule,
	ModuleRegistry,
	type RowSelectedEvent,
	type SelectionChangedEvent,
} from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react"; // React Data Grid Component
import { LoaderIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
} from "react";
import type z from "zod";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ItemDetail } from "@/features/sheet/Row";
import { EFFECT_SUBJECTS } from "@/types/effect";
import type { ItemWithBuff } from "@/types/Item";
import type { searchConditionQuerySchema } from "../searchCondition/type";
import { useSearchResultQuery } from "./useSearchResultQuery";

ModuleRegistry.registerModules([AllCommunityModule, ColumnAutoSizeModule]);

type Data = Record<string, unknown>;

const columnHelper = createColumnHelper<Data>();

type SearchResultProps = {
	pagination: PaginationState;
	setPagination: Dispatch<SetStateAction<PaginationState>>;
};

function SearchResult({
	searchResults,
	allNumber,
	pagination,
	setPagination,
	isLoading,
}: {
	searchResults: ItemWithBuff[];
	allNumber: number;
	isLoading: boolean;
} & SearchResultProps) {
	const searchResultsSubjects: string[] = useMemo(() => {
		const subjectsWithMethod = [
			...new Set(
				searchResults.flatMap((item) => [
					...item.effects.map((e) => `${e.subject}`),
					...(item.buff?.effects?.flatMap((e) =>
						e.type === "statusUp"
							? `${e.subject}${e.numberType ? `-${e.numberType}` : ""}`
							: [],
					) ?? []),
				]),
			),
		].map((subject) => {
			const [subjectName, numberType] = subject.split("-") as [string, string];
			return { subjectName, numberType };
		});

		return subjectsWithMethod
			.sort((a, b) => {
				const order = EFFECT_SUBJECTS.map((e) => e.value as string);
				return order.indexOf(a.subjectName) - order.indexOf(b.subjectName);
			})
			.map((e) => `${e.subjectName}${e.numberType === "percent" ? "(%)" : ""}`);
	}, [searchResults]);

	const rowData = useMemo(
		() =>
			searchResults.map((r) => {
				type Effect = { value: number; method: string };
				const effects: Record<string, Effect[]> = {};

				r.effects.forEach((e) => {
					if (!effects[e.subject]) {
						effects[e.subject] = [];
					}
					effects[e.subject]?.push({
						value: e.value,
						method: "add",
					});
				});

				(r.buff?.effects ?? []).forEach((e) => {
					if (e.type !== "statusUp") return;
					if (!effects[e.subject]) {
						effects[e.subject] = [];
					}
					effects[e.subject]?.push({
						value: e.value,
						method: e.numberType === "percent" ? "multiply" : "add",
					});
				});

				// subjectごとに、addとmultiplyをまとめる
				const mergedEffects: Record<
					string /* subject */,
					{ add?: number; multiply?: number }
				> = {};

				Object.entries(effects).forEach(([subject, effectList]) => {
					effectList.forEach((effect) => {
						if (!mergedEffects[subject]) {
							mergedEffects[subject] = {};
						}
						if (effect.method === "add") {
							mergedEffects[subject].add =
								(mergedEffects[subject].add ?? 0) + effect.value;
						} else if (effect.method === "multiply") {
							mergedEffects[subject].multiply =
								(mergedEffects[subject].multiply ?? 0) + effect.value;
						}
					});
				});

				// addの場合はsubjectのみ、multiplyの場合はsubject(倍率)とする
				const mergedEffectsFormatted: Record<string, number> = {};
				Object.entries(mergedEffects).forEach(([subject, effect]) => {
					if (effect.add !== undefined) {
						mergedEffectsFormatted[subject] = effect.add;
					}
					if (effect.multiply !== undefined) {
						mergedEffectsFormatted[`${subject}(%)`] = effect.multiply;
					}
				});

				return {
					...mergedEffectsFormatted,
					name: r.name,
				};
			}),
		[searchResults],
	);

	const columns = useMemo<TableOptions<Data>["columns"]>(
		() => [
			columnHelper.accessor("name", {
				cell: (info) => {
					return (
						<div className="flex items-center gap-1">
							{isLoading ? (
								<LoaderIcon size="1em" className="animate-spin " />
							) : (
								""
							)}
							{info.getValue()}
						</div>
					);
				},
				header: () => <span>アイテム名</span>,
			}),
			...searchResultsSubjects.map((subject) =>
				columnHelper.accessor(subject, {
					cell: (info) => {
						return info.getValue();
					},
					header: () => <span>{subject}</span>,
				}),
			),
			columnHelper.accessor("詳細", {
				cell: (info) => {
					const item = searchResults.find(
						(r) => r.name === info.row.original.name,
					);
					if (!item) return null;
					return <ItemDetail item={item} />;
				},
				maxSize: 10,
				size: 10,
			}),
		],
		[searchResultsSubjects, isLoading, searchResults.find],
	);

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

	const table = useReactTable({
		data: rowData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		rowCount: allNumber,
		onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
		state: {
			//...
			pagination,
		},
	});

	return (
		<div style={{ height: "800px" }}>
			<div className="border rounded-md">
				<Table className="compact-table grid-table bg-white">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-center">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className={cell.column.id === "name" ? "" : "text-center"}
									>
										{/* Render the cell content using the flexRender function */}
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="flex justify-center w-full border-t p-1 bg-white">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								{table.getCanPreviousPage() && (
									<PaginationLink
										onClick={() => table.firstPage()}
										aria-disabled={!table.getCanPreviousPage()}
										href="#"
									>
										1
									</PaginationLink>
								)}
							</PaginationItem>

							{table.getState().pagination.pageIndex > 1 &&
								table.getCanPreviousPage() && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

							{table.getCanPreviousPage() &&
								table.getState().pagination.pageIndex > 1 && (
									<PaginationItem>
										<PaginationLink
											onClick={() => table.previousPage()}
											aria-disabled={!table.getCanPreviousPage()}
											href="#"
										>
											{"<"}
										</PaginationLink>
									</PaginationItem>
								)}

							<PaginationItem aria-disabled>
								<PaginationLink href="#" aria-disabled className="bg-accent">
									{table.getState().pagination.pageIndex + 1}
								</PaginationLink>
							</PaginationItem>

							{table.getState().pagination.pageIndex + 1 <
								table.getPageCount() - 1 && (
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={() => table.nextPage()}
										aria-disabled={!table.getCanNextPage()}
									>
										{">"}
									</PaginationLink>
								</PaginationItem>
							)}
							{table.getPageCount() - table.getState().pagination.pageIndex >
								2 &&
								table.getCanNextPage() && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}
							{table.getCanNextPage() && (
								<PaginationItem>
									<PaginationLink
										onClick={() => table.lastPage()}
										aria-disabled={!table.getCanNextPage()}
										href="#"
									>
										{table.getPageCount()}
									</PaginationLink>
								</PaginationItem>
							)}
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
}

const SearchResultWithQuery = ({
	searchConditionQuery,
	pagination,
	setPagination,
}: {
	searchConditionQuery: z.infer<typeof searchConditionQuerySchema>;
} & SearchResultProps) => {
	const queryWithPage = useMemo(() => {
		return { ...searchConditionQuery, ...pagination };
	}, [searchConditionQuery, pagination]);

	const response = useSearchResultQuery(queryWithPage);

	if (response.error) {
		return <p>Error: {response.error.message}</p>;
	}

	if (!response.data) {
		if (response.isLoading) {
			return <LoaderIcon className="animate-spin" />;
		}
		if (response.isFetching) {
			return <LoaderIcon className="animate-spin" />;
		}

		return <p>No results found.</p>;
	}

	return (
		<SearchResult
			searchResults={response.data.items}
			allNumber={response.data.allNumber}
			pagination={pagination}
			setPagination={setPagination}
			isLoading={response.isLoading || response.isFetching}
		/>
	);
};

export { SearchResultWithQuery as SearchResult };
