import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import type { frourioSpec } from "@/app/api/search/condition/frourio";
import { apiClient, apiUrl } from "@/features/api/apiClient";
import { fetchJson } from "@/lib/fetchWithErrorHandling";

export const useSearchConditions = () => {
	const [key, fetcher] = apiClient["search/condition"].$build();

	const response = useQuery<
		z.infer<(typeof frourioSpec.get.res)["200"]["body"]>
	>({
		queryKey: ["search/condition"],
		queryFn: () =>
			fetchJson<z.infer<(typeof frourioSpec.get.res)["200"]["body"]>>(
				`${apiUrl}/search/condition`,
			),
	});

	return response;
};
