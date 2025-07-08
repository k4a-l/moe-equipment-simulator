import {
	type DefaultError,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useRef } from "react";
import type z from "zod";
import type { frourioSpec } from "@/app/api/search/result/frourio";
import { apiUrl } from "@/features/api/apiClient";
import { fetchJson } from "@/lib/fetchWithErrorHandling";
import type { searchConditionQuerySchemaWithPage } from "../searchCondition/type";

const key = "search/result";

export const useSearchResultQuery = (
	query: z.infer<typeof searchConditionQuerySchemaWithPage>,
) => {
	const previousQuery = useRef(query);
	const queryClient = useQueryClient();

	// Queries
	const response = useQuery<
		z.infer<(typeof frourioSpec.post.res)["200"]["body"]>,
		DefaultError
	>({
		queryKey: [key, query],
		queryFn: () =>
			fetchJson<z.infer<(typeof frourioSpec.post.res)["200"]["body"]>>(
				`${apiUrl}/${key}`,
				{
					body: JSON.stringify(query),
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
				},
			).finally(() => {
				previousQuery.current = query;
			}),
		placeholderData: () => {
			const c = queryClient.getQueryData([key, previousQuery.current]);
			return c as z.infer<(typeof frourioSpec.post.res)["200"]["body"]>;
		},
	});

	return response;
};
