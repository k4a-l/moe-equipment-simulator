import { type DefaultError, useQuery } from "@tanstack/react-query";
import type z from "zod";
import type { frourioSpec } from "@/app/api/item/frourio";
import { fetchJson } from "@/lib/fetchWithErrorHandling";
import { apiUrl } from "../api/apiClient";

const key = "item";

export const useItems = (query: z.infer<typeof frourioSpec.post.body>) => {
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
			),
	});

	return response;
};
