import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";
import { effectSubjectSchema } from "@/types/effect";

export const frourioSpec = {
	get: {
		res: {
			200: {
				body: z.object({ effectsSubjects: z.array(effectSubjectSchema) }),
			},
		},
	},
} satisfies FrourioSpec;
