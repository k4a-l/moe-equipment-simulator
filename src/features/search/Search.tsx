"use client";

import { LoaderIcon, MegaphoneIcon } from "lucide-react";
import Link from "next/link";
import { type ComponentProps, useCallback, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import type z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

	const searchConditionsResponse = useSearchConditions();

	const [conditions, setConditions] = useSessionStorage<SearchConditionType[]>(
		createSearchConditionKey("conditions"),
		[{ uuid: crypto.randomUUID() }],
	);

	return (
		<div className="flex gap-2 flex-col">
			{searchConditionsResponse.isLoading ||
			searchConditionsResponse.isValidating ? (
				<LoaderIcon size="1em" className="animate-spin " />
			) : searchConditionsResponse.error ? (
				<p className="text-red-500">
					{JSON.stringify(searchConditionsResponse.error)}
				</p>
			) : (
				searchConditionsResponse.data && (
					<div className="flex flex-col gap-2">
						<Alert variant="default">
							<MegaphoneIcon />
							<AlertTitle>
								バフ情報が反映されていません (済み：{" "}
								{searchConditionsResponse.data.buffImplementation.implemented} /
								{searchConditionsResponse.data.buffImplementation.all})
							</AlertTitle>
							<AlertDescription>
								<p>
									<Link
										href="https://github.com/k4a-l/moe-equipment-assets/issues/1"
										target="_blank"
										rel="noopener noreferrer"
										className="underline hover:text-blue-600"
									>
										こちらのGitHubリポジトリ
									</Link>
									より入力のご協力をお願いいたします
								</p>
							</AlertDescription>
						</Alert>
						<SearchConditionContainer
							conditions={conditions}
							setConditions={setConditions}
							effectsSubjects={searchConditionsResponse.data.effectsSubjects}
							execSearch={execSearch}
							staticPart={staticPart}
						/>
					</div>
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
