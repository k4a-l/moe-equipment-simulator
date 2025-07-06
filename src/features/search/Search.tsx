"use client";

import { LoaderIcon } from "lucide-react";
import { type ComponentProps, useCallback, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import type z from "zod";
import {
	createSearchConditionKey,
	SearchConditionContainer,
} from "./searchCondition/SearchConditionContainer";
import type {
	SearchConditionType,
	searchConditionQuerySchema,
} from "./searchCondition/type";
import { useSearchConditions } from "./searchCondition/useSearchConditionQuery";
import { SearchResult } from "./searchResult/SearchResult";

export function Search({
	onSelect,
	staticPart,
}: Pick<ComponentProps<typeof SearchResult>, "onSelect"> &
	Pick<ComponentProps<typeof SearchConditionContainer>, "staticPart">) {
	const [searchConditionQuery, setSearchConditionQuery] = useState<
		z.infer<typeof searchConditionQuerySchema> | undefined
	>(undefined);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
	});

	const execSearch = useCallback(
		(query: z.infer<typeof searchConditionQuerySchema>) => {
			setSearchConditionQuery({ ...query });
		},
		[],
	);

	const effectsSubjectsResponse = useSearchConditions();

	const [conditions, setConditions] = useSessionStorage<SearchConditionType[]>(
		createSearchConditionKey("conditions"),
		[{ uuid: crypto.randomUUID() }],
	);

	return (
		<div className="flex gap-2 flex-col">
			{effectsSubjectsResponse.isLoading ||
			effectsSubjectsResponse.isValidating ? (
				<LoaderIcon size="1em" className="animate-spin " />
			) : effectsSubjectsResponse.error ? (
				<p className="text-red-500">
					{JSON.stringify(effectsSubjectsResponse.error)}
				</p>
			) : (
				effectsSubjectsResponse.data && (
					<SearchConditionContainer
						conditions={conditions}
						setConditions={setConditions}
						effectsSubjects={effectsSubjectsResponse.data.effectsSubjects}
						execSearch={execSearch}
						staticPart={staticPart}
					/>
				)
			)}
			{searchConditionQuery && (
				<SearchResult
					searchConditionQuery={searchConditionQuery}
					pagination={pagination}
					setPagination={setPagination}
					onSelect={onSelect}
				/>
			)}
		</div>
	);
}
