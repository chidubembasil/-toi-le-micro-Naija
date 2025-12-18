const MEILISEARCH_HOST = "http://localhost:7700";
const MEILISEARCH_API_KEY = "your-api-key";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "article" | "podcast" | "exercise" | "gallery";
  url: string;
  image?: string;
  createdAt: string;
}

// Meilisearch response type
interface MeiliHit extends Partial<SearchResult> {
  [key: string]: unknown;
}

interface MeiliSearchResponse {
  hits: MeiliHit[];
  offset: number;
  limit: number;
  processingTimeMs: number;
  query: string;
}

export async function searchContent(
  query: string,
  filters?: {
    type?: string;
    category?: string;
    state?: string;
  }
): Promise<SearchResult[]> {
  try {
    const params = new URLSearchParams({ q: query });

    if (filters?.type) params.append("filter", `type = ${filters.type}`);
    if (filters?.category) params.append("filter", `category = ${filters.category}`);
    if (filters?.state) params.append("filter", `state = ${filters.state}`);

    const response = await fetch(
      `${MEILISEARCH_HOST}/indexes/content/search?${params.toString()}`,
      { headers: { Authorization: `Bearer ${MEILISEARCH_API_KEY}` } }
    );

    if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);

    const data: MeiliSearchResponse = await response.json();
    return (data.hits as SearchResult[]) || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

// Index content
export async function indexContent(
  documents: Array<Omit<SearchResult, "url"> & { [key: string]: unknown }>
): Promise<void> {
  try {
    const response = await fetch(`${MEILISEARCH_HOST}/indexes/content/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MEILISEARCH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documents),
    });

    if (!response.ok) throw new Error(`Indexing failed: ${response.statusText}`);
  } catch (error) {
    console.error("Indexing error:", error);
  }
}

// Autocomplete suggestions
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${MEILISEARCH_HOST}/indexes/content/search?q=${encodeURIComponent(query)}&limit=5`,
      { headers: { Authorization: `Bearer ${MEILISEARCH_API_KEY}` } }
    );

    if (!response.ok) throw new Error(`Suggestions failed: ${response.statusText}`);

    const data: MeiliSearchResponse = await response.json();
    return data.hits.map((hit) => hit.title || "").filter(Boolean);
  } catch (error) {
    console.error("Suggestions error:", error);
    return [];
  }
}
