import useSWR from "swr";
import type { z } from "zod";
import type { frourioSpec } from "@/app/api/search/condition/frourio";
import { apiClient } from "@/features/api/apiClient";

export const useSearchConditions = () => {
	const [key, fetcher] = apiClient["search/condition"].$build();

	const response = useSWR<z.infer<(typeof frourioSpec.get.res)["200"]["body"]>>(
		"search/condition",
		() =>
			fetch("http://localhost:3000/api/search/condition").then((res) =>
				res.json(),
			),
	);

	return response;
};
