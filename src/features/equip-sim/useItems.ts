import { type DefaultError, useQuery } from "@tanstack/react-query";
import type z from "zod";
import type { frourioSpec } from "@/app/api/item/frourio";

const key = "item";

export const useItems = (query: z.infer<typeof frourioSpec.post.body>) => {
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
			}).then((res) => {
				return res.json();
			}),
	});

	return response;
};
