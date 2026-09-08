import { products, type Product } from "@/data/products";
import { categoriesBySlug } from "@/data/categories";

/** Lightweight synonym map so common shop-floor terms hit the right products. */
const SYNONYMS: Record<string, string[]> = {
  pcd: ["diamante", "policristalino"],
  disco: ["sierra"],
  cono: ["portaherramientas", "hsk", "iso"],
  pinza: ["portapinzas", "er"],
  tupi: ["tupí", "portacuchillas"],
  broca: ["taladrar", "taladro"],
  fresa: ["fresado", "fresadora"],
  cuchilla: ["cuchillas", "perfilado"],
  reafilado: ["afilado", "afilar", "reafilar"],
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

type Indexed = { product: Product; haystack: string };

const index: Indexed[] = products.map((p) => {
  const cat = categoriesBySlug[p.categorySlug];
  const parts = [
    p.name,
    p.ref,
    p.summary,
    cat?.name ?? "",
    cat?.shortName ?? "",
    ...p.features,
    ...p.sectors,
    ...p.materials,
  ];
  const extra = Object.entries(SYNONYMS)
    .filter(([k]) => norm(parts.join(" ")).includes(k))
    .flatMap(([, v]) => v);
  return { product: p, haystack: norm([...parts, ...extra].join(" ")) };
});

export type SearchResult = { product: Product; score: number };

export function searchProducts(query: string, limit = 8): SearchResult[] {
  const q = norm(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];
  for (const { product, haystack } of index) {
    let score = 0;
    for (const term of terms) {
      if (!haystack.includes(term)) {
        score = -1;
        break;
      }
      score += 1;
      if (norm(product.name).includes(term)) score += 2;
      if (norm(product.ref).includes(term)) score += 3;
    }
    if (score > 0) results.push({ product, score });
  }
  return results
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit);
}
