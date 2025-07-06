import useSWR from "swr";
import type { z } from "zod";
import type { frourioSpec } from "@/app/api/search/condition/frourio";
import { apiClient, apiUrl } from "@/features/api/apiClient";

export const useSearchConditions = () => {
	const [key, fetcher] = apiClient["search/condition"].$build();

	const response = useSWR<z.infer<(typeof frourioSpec.get.res)["200"]["body"]>>(
		"search/condition",
		() => fetch(`${apiUrl}/search/condition`).then((res) => res.json()),
	);

	return response;
};
