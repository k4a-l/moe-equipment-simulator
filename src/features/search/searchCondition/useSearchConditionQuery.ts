import useSWR from "swr";
import { apiClient } from "@/features/api/apiClient";

export const useSearchConditions = () => {
	const [key, fetcher] = apiClient["search/condition"].$build();

	const response = useSWR("search/condition", () =>
		fetch("http://localhost:3000/api/search/condition").then((res) =>
			res.json(),
		),
	);

	return response;
};
