// Matches backend Zod schema + DB table + returned API shape

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  state?: string;
  language: "en" | "fr";

  // Status fields
  status: "draft" | "published";

  // Relational / authorship
  authorId: number;

  // Dates
  createdAt: string;
  updatedAt: string;
  publishedAt?: string; // only present when published
}

// When creating a new article (POST /news)
export type NewsCreateDTO = Omit<
  NewsItem,
  "id" | "authorId" | "status" | "createdAt" | "updatedAt" | "publishedAt"
>;

// When updating an article (PUT /news/:id)
export type NewsUpdateDTO = Partial<NewsCreateDTO>;
