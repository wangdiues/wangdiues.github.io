import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { contentSlug } from "../lib/content-id";

export async function GET(context) {
  const publications = (await getCollection("publications")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: "Wangdi Wangdi — Research outputs",
    description:
      "Publications, manuscripts, management plans, and conservation strategies from a Bhutanese forestry and conservation researcher.",
    site: context.site,
    items: publications.map((pub) => ({
      title: pub.data.title,
      pubDate: pub.data.date,
      description: (pub.body ?? "").slice(0, 280),
      link: `/publications/${contentSlug(pub.id)}/`,
      categories: pub.data.tags,
    })),
    customData: "<language>en</language>",
  });
}
