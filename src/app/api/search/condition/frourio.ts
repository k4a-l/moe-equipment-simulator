import type { FrourioSpec } from "@frourio/next";
import { effectSubjectSchema } from "moe-equipment-assets/types/effect";
import { z } from "zod";

export const frourioSpec = {
	get: {
		res: {
			200: {
				body: z.object({ effectsSubjects: z.array(effectSubjectSchema) }),
			},
		},
	},
} satisfies FrourioSpec;
