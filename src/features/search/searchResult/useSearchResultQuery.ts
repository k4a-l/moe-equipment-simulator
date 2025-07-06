import {
	type DefaultError,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import type z from "zod";
import type { frourioSpec } from "@/app/api/search/result/frourio";
import { apiClient } from "@/features/api/apiClient";
import type { searchConditionQuerySchemaWithPage } from "../searchCondition/type";

const post = apiClient["search/result"].$post;

const key = "search/result";

export const useSearchResultQuery = (
	query: z.infer<typeof searchConditionQuerySchemaWithPage>,
) => {
	const previousQuery = useRef(query);
	const queryClient = useQueryClient();

	// Queries
	const response = useQuery<
		typeof query,
		DefaultError,
		z.infer<(typeof frourioSpec.post.res)["200"]["body"]>
	>({
		queryKey: [key, query],
		queryFn: () =>
			fetch(`http://localhost:3000/api/${key}`, {
				body: JSON.stringify(query),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			})
				.then((res) => {
					return res.json();
				})
				.finally(() => {
					previousQuery.current = query;
				}),
		// @ts-expect-error
		placeholderData: (prev) => {
			const c = queryClient.getQueryData([key, previousQuery.current]);
			return c as z.infer<(typeof frourioSpec.post.res)["200"]["body"]>;
		},
	});

	return response;
};
