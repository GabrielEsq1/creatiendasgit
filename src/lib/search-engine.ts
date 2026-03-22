
import { Product } from './store-service';

export interface SearchResult {
    product: Product;
    score: number;
    matchedKeywords: string[];
}

const SEARCH_WEIGHTS = {
    NAME_EXACT: 100,
    NAME_PARTIAL: 70,
    CATEGORY_MATCH: 50,
    TAGS_MATCH: 40,
    DESCRIPTION_MATCH: 10,
};

const MIN_SCORE_THRESHOLD = 20;

const SYNONYMS: Record<string, string[]> = {
    'tenis': ['sneakers', 'zapatillas', 'deportivo', 'training shoes', 'gym shoes'],
    'sneakers': ['tenis', 'zapatillas'],
    'camiseta': ['t-shirt', 'playera', 'remera', 'top'],
    't-shirt': ['camiseta', 'playera'],
    'pantalon': ['pants', 'jeans', 'trousers'],
    'buso': ['hoodie', 'sweater', 'chaqueta'],
    'hoodie': ['buso', 'sweater'],
    'zapatos': ['calzado', 'shoes', 'botas'],
};

/**
 * Normalizes text for comparison (lowercase, remove accents, etc.)
 */
export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Gets all relevant versions of a keyword including synonyms
 */
function getQueryKeywords(query: string): string[] {
    const primaryKeywords = normalizeText(query).split(/\s+/).filter(k => k.length > 1);
    const allKeywords = [...primaryKeywords];

    primaryKeywords.forEach(kw => {
        if (SYNONYMS[kw]) {
            allKeywords.push(...SYNONYMS[kw]);
        }
        // Also check if any synonym key includes our keyword
        Object.keys(SYNONYMS).forEach(key => {
            if (key !== kw && SYNONYMS[key].includes(kw)) {
                allKeywords.push(key);
            }
        });
    });

    return Array.from(new Set(allKeywords));
}

/**
 * Advanced weighted search engine for products
 */
export function searchProducts(
    products: Product[],
    query: string,
    options: {
        limit?: number,
        threshold?: number,
        boostBySales?: boolean,
        boostByViews?: boolean
    } = {}
): SearchResult[] {
    if (!query || query.trim().length === 0) {
        return products.map(p => ({ product: p, score: 0, matchedKeywords: [] }));
    }

    const keywords = getQueryKeywords(query);
    const normalizedQuery = normalizeText(query);
    const limit = options.limit || 50;
    const threshold = options.threshold ?? MIN_SCORE_THRESHOLD;

    const results: SearchResult[] = products.map(product => {
        let score = 0;
        const matchedKeywords = new Set<string>();

        const name = normalizeText(product.name);
        const description = normalizeText(product.description);
        const category = normalizeText(product.category);
        const productTags = (product.tags || []).map(t => normalizeText(t));

        // 1. Product Name Priority
        if (name === normalizedQuery) {
            score += SEARCH_WEIGHTS.NAME_EXACT;
            matchedKeywords.add(normalizedQuery);
        } else if (name.includes(normalizedQuery)) {
            score += SEARCH_WEIGHTS.NAME_PARTIAL;
            matchedKeywords.add(normalizedQuery);
        }

        // Keyword based scoring
        keywords.forEach(kw => {
            let hit = false;
            
            // Name keyword match
            if (name.includes(kw)) {
                score += SEARCH_WEIGHTS.NAME_PARTIAL / keywords.length;
                matchedKeywords.add(kw);
                hit = true;
            }

            // Category match
            if (category.includes(kw)) {
                score += SEARCH_WEIGHTS.CATEGORY_MATCH;
                matchedKeywords.add(kw);
                hit = true;
            }

            // Tags match
            if (productTags.some(t => t.includes(kw))) {
                score += SEARCH_WEIGHTS.TAGS_MATCH;
                matchedKeywords.add(kw);
                hit = true;
            }

            // Description match (fallback)
            if (description.includes(kw)) {
                score += SEARCH_WEIGHTS.DESCRIPTION_MATCH;
                matchedKeywords.add(kw);
                hit = true;
            }
        });

        // 2. Boosting
        if (options.boostBySales && product.salesCount) {
            score += Math.min(product.salesCount / 10, 20); // Cap boost
        }
        if (options.boostByViews && product.views) {
            score += Math.min(product.views / 100, 10); // Cap boost
        }
        if (product.conversionRate) {
            score += product.conversionRate * 10;
        }

        return {
            product,
            score,
            matchedKeywords: Array.from(matchedKeywords)
        };
    });

    // Filter, Sort and Limit
    return results
        .filter(r => r.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}
