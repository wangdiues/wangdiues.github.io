import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    status: z.enum(["published", "under-review", "in-preparation", "report"]),
    docType: z
      .enum(["research", "management-plan", "strategy"])
      .default("research"),
    year: z.coerce.number(),
    date: z.coerce.date(),
    venue: z.string(),
    authors: z.string(),
    doi: z.string().optional(),
    external: z.string().url().optional(),
    pdf: z
      .string()
      .regex(/^\/publications\/.+\.pdf$/)
      .optional(),
    rightsLicense: z.string().optional(),
    rightsNote: z.string().optional(),
    geo: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    region: z.string(),
    focus: z.string(),
    impact: z.string(),
    methods: z.array(z.string()).default([]),
    project: z
      .object({
        year: z.coerce.number(),
        role: z.string(),
        team: z.array(z.string()).min(1),
        categories: z.array(z.string()).min(1),
        summary: z.string(),
        assetGroup: z.string(),
        hero: z.object({
          asset: z.string(),
          alt: z.string(),
        }),
        award: z.object({
          organization: z.string(),
          name: z.string(),
          year: z.coerce.number(),
          url: z.string().url(),
        }),
        approaches: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              points: z.array(z.string()).min(1),
            })
          )
          .min(1),
        community: z.object({
          description: z.string(),
          points: z.array(z.string()).min(1),
        }),
        outputs: z.array(z.string()).min(1),
        gallery: z
          .array(
            z.object({
              asset: z.string(),
              alt: z.string(),
              caption: z.string(),
            })
          )
          .min(1),
        document: z.object({
          href: z.string().regex(/^\/CLP\/.+\.pdf$/i),
          label: z.string(),
        }),
      })
      .optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    tab: z.string(),
    title: z.string(),
    company: z.string(),
    location: z.string(),
    range: z.string(),
    date: z.coerce.date(),
    url: z.string().optional(),
  }),
});

export const collections = {
  publications,
  "case-studies": caseStudies,
  experience,
};
