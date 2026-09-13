import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      editPost: z
        .object({
          disabled: z.boolean().optional(),
          url: z.string().optional(),
          text: z.string().optional(),
          appendFilePath: z.boolean().optional(),
        })
        .optional(),
    }),
});

const albums = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/albums" }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    theme: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
      message: "Album theme must be a 6-digit hex color.",
    }),
    cover: z.string().min(1),
    date: z.date().optional(),
    tracks: z.array(
      z.object({
        name: z.string(),
        artist: z.string().optional(),
        url: z.url(),
      })
    ),
    lyrics: z
      .array(
        z.object({
          time: z.number(),
          text: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blog, albums };
