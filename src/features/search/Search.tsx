"use client";

import { useCallback, useState } from "react";
import type z from "zod";
import type { EffectSubjectType } from "@/types/effect";
import { SearchConditionContainer } from "./searchCondition/SearchConditionContainer";
import type {
	SearchConditionType,
	searchConditionQuerySchema,
} from "./searchCondition/type";
import { useSearchConditions } from "./searchCondition/useSearchConditionQuery";
import { SearchResult } from "./searchResult/SearchResult";

export function Search() {
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

	const effectsSubjects: EffectSubjectType[] =
		useSearchConditions().data?.effectsSubjects ?? [];

	const [searchConditions, setSearchConditions] = useState<
		SearchConditionType[]
	>([{ uuid: crypto.randomUUID(), valueType: "add" }]);

	return (
		<div className="flex gap-2 flex-col">
			{/* <Accordion type="multiple" defaultValue={["item-1"]}>
				<AccordionItem value="item-1" defaultChecked>
					<AccordionTrigger> */}
			{/* <p className="text-2xl">検索条件</p> */}
			{/* </AccordionTrigger>
					<AccordionContent> */}
			<SearchConditionContainer
				conditions={searchConditions}
				setConditions={setSearchConditions}
				effectsSubjects={effectsSubjects}
				execSearch={execSearch}
			/>
			{/* </AccordionContent>
				</AccordionItem>
			</Accordion> */}
			{searchConditionQuery && (
				<SearchResult
					searchConditionQuery={searchConditionQuery}
					pagination={pagination}
					setPagination={setPagination}
				/>
			)}
		</div>
	);
}
