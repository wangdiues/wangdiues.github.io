import type { CollectionEntry } from "astro:content";

type Publication = CollectionEntry<"publications">;
type CaseStudy = CollectionEntry<"case-studies">;

export function formatCitation(pub: Publication): string {
  const { title, authors, venue, year, status, doi } = pub.data;
  let citation = `${authors} (${year}). ${title}. ${venue}.`;
  if (status === "under-review") citation += " [Manuscript under review]";
  if (status === "in-preparation") citation += " [Manuscript in preparation]";
  if (doi) citation += ` https://doi.org/${doi}`;
  return citation;
}

export function splitAuthors(authors: string): string[] {
  return authors
    .split(/,\s*|\s+&\s+/)
    .map((a) => a.trim().replace(/\.$/, ""))
    .filter(Boolean);
}

export function relatedCaseStudies(
  pub: Publication,
  studies: CaseStudy[]
): CaseStudy[] {
  return studies
    .filter((study) => {
      const haystack = `${study.data.title} ${study.data.region} ${
        study.data.focus
      } ${study.data.impact} ${study.data.methods.join(" ")}`.toLowerCase();
      return pub.data.tags.some((tag) => {
        const key = tag.toLowerCase().split(/[\s–-]/)[0];
        return key.length > 3 && haystack.includes(key);
      });
    })
    .slice(0, 2);
}
