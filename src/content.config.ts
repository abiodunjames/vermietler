import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    author: z.string().default("Vermietler Team"),
    lang: z.enum(["en", "de"]).default("en"),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    // Optional structured-data extras (GEO/SEO uplift)
    tldr: z.string().optional(),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .optional(),
    howTo: z
      .object({
        name: z.string(),
        description: z.string().optional(),
        steps: z.array(z.object({ name: z.string(), text: z.string() })),
      })
      .optional(),
    sources: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .optional(),
  }),
});

export const collections = { blog };
