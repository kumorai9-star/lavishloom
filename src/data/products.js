// Temporary local data so the UI is fully functional before /api/products is wired up.
// Each product tracks stock per size+color combination via `variants`, belongs to a
// `category` (Boys/Girls) and a `type` (Jacket/Trousers/Shorts/Shirt/Tank/Cami/Skirt/Set)
// so search can understand queries like "red trousers" or "shirts for girls".
// Sizes run from 2Y to 12Y across the whole catalog.

export const categories = ["Boys", "Girls"];

export const sizeRange = ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "10Y", "11Y", "12Y"];

export const products = [
  {
    _id: "p1",
    name: "Heirloom Denim Utility Jacket",
    price: 185,
    collection: "Heritage Collection",
    category: "Boys",
    type: "Jacket",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [
      { name: "Deep Indigo", hex: "#1B2A41" },
      { name: "Rust", hex: "#B4713F" },
      { name: "Stone", hex: "#DCD4C5" },
    ],
    variants: [
      { size: "2Y", color: "Deep Indigo", stock: 5 },
      { size: "2Y", color: "Rust", stock: 0 },
      { size: "2Y", color: "Stone", stock: 3 },
      { size: "4Y", color: "Deep Indigo", stock: 0 },
      { size: "4Y", color: "Rust", stock: 8 },
      { size: "4Y", color: "Stone", stock: 2 },
      { size: "6Y", color: "Deep Indigo", stock: 4 },
      { size: "6Y", color: "Rust", stock: 0 },
      { size: "6Y", color: "Stone", stock: 6 },
      { size: "8Y", color: "Deep Indigo", stock: 0 },
      { size: "8Y", color: "Rust", stock: 0 },
      { size: "8Y", color: "Stone", stock: 0 },
    ],
    images: ["/src/assets/pic1.jpeg", "/src/assets/hero.png"],
    description:
      "Crafted from premium 12oz raw Japanese denim, this utility jacket is designed to age beautifully through generations. Featuring reinforced patch pockets, triple-needle stitching, and a tailored yet comfortable fit for active play.",
    rating: 5,
    reviews: 48,
  },
  {
    _id: "p2",
    name: "Artisan Wide Trousers",
    price: 125,
    collection: "The Solstice Edit",
    category: "Boys",
    type: "Trousers",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: [{ name: "Sandstone", hex: "#C9A688" }],
    variants: [
      { size: "2Y", color: "Sandstone", stock: 6 },
      { size: "4Y", color: "Sandstone", stock: 0 },
      { size: "6Y", color: "Sandstone", stock: 4 },
      { size: "8Y", color: "Sandstone", stock: 2 },
      { size: "10Y", color: "Sandstone", stock: 3 },
    ],
    images: ["/src/assets/pic6.jpeg"],
    description: "Relaxed-fit trousers in brushed cotton twill, built for climbing trees and long afternoons outside.",
    rating: 5,
    reviews: 21,
  },
  {
    _id: "p3",
    name: "Linen Pinstripe Ensemble",
    price: 210,
    collection: "Premium Linen",
    category: "Girls",
    type: "Set",
    sizes: ["2Y", "4Y", "6Y"],
    colors: [{ name: "Sandstone / Ivory", hex: "#EDE6D6" }],
    variants: [
      { size: "2Y", color: "Sandstone / Ivory", stock: 3 },
      { size: "4Y", color: "Sandstone / Ivory", stock: 0 },
      { size: "6Y", color: "Sandstone / Ivory", stock: 5 },
    ],
    images: ["/src/assets/pic7.jpeg"],
    description: "A two-piece linen set with a hand-finished pinstripe weave, soft against delicate skin.",
    rating: 4,
    reviews: 12,
  },
  {
    _id: "p4",
    name: "Studio Ribbed Tank",
    price: 68,
    collection: "Latest Arrivals",
    category: "Girls",
    type: "Tank",
    sizes: ["2Y", "4Y", "6Y"],
    colors: [
      { name: "Black", hex: "#1B2436" },
      { name: "Red", hex: "#B23A3A" },
    ],
    variants: [
      { size: "2Y", color: "Black", stock: 4 },
      { size: "2Y", color: "Red", stock: 0 },
      { size: "4Y", color: "Black", stock: 0 },
      { size: "4Y", color: "Red", stock: 7 },
      { size: "6Y", color: "Black", stock: 2 },
      { size: "6Y", color: "Red", stock: 3 },
    ],
    images: ["/src/assets/hero.png"],
    description: "A ribbed knit tank layered for play or dressed up for the studio.",
    rating: 5,
    reviews: 9,
  },
  {
    _id: "p5",
    name: "Coastal Stripe Cami",
    price: 82,
    collection: "Latest Arrivals",
    category: "Girls",
    type: "Cami",
    sizes: ["4Y", "6Y", "8Y"],
    colors: [{ name: "Red Stripe", hex: "#B23A3A" }],
    variants: [
      { size: "4Y", color: "Red Stripe", stock: 5 },
      { size: "6Y", color: "Red Stripe", stock: 0 },
      { size: "8Y", color: "Red Stripe", stock: 1 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Breton-inspired stripes in organic cotton jersey, cut for warm-weather wandering.",
    rating: 5,
    reviews: 15,
  },
  {
    _id: "p6",
    name: "Linen Heritage Set",
    price: 185,
    collection: "Denim Heritage",
    category: "Girls",
    type: "Set",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: [{ name: "Sandstone", hex: "#C9A688" }],
    variants: [
      { size: "2Y", color: "Sandstone", stock: 0 },
      { size: "4Y", color: "Sandstone", stock: 6 },
      { size: "6Y", color: "Sandstone", stock: 3 },
      { size: "8Y", color: "Sandstone", stock: 0 },
      { size: "10Y", color: "Sandstone", stock: 2 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Artisanal weave, sandstone tone — a foundational piece for the curated wardrobe.",
    rating: 5,
    reviews: 18,
  },
  {
    _id: "p7",
    name: "Atelier Plaid Skirt",
    price: 142,
    collection: "Denim Heritage",
    category: "Girls",
    type: "Skirt",
    sizes: ["4Y", "6Y", "8Y"],
    colors: [{ name: "Plaid", hex: "#3A3A3A" }],
    variants: [
      { size: "4Y", color: "Plaid", stock: 2 },
      { size: "6Y", color: "Plaid", stock: 0 },
      { size: "8Y", color: "Plaid", stock: 4 },
    ],
    images: ["/src/assets/hero.png"],
    description: "A limited edition workshop piece in heritage plaid wool blend.",
    rating: 5,
    reviews: 7,
    isNew: true,
  },
  {
    _id: "p8",
    name: "Indigo Chore Jacket",
    price: 210,
    collection: "Denim Heritage",
    category: "Boys",
    type: "Jacket",
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: [{ name: "Navy Heritage", hex: "#1B2A41" }],
    variants: [
      { size: "4Y", color: "Navy Heritage", stock: 0 },
      { size: "6Y", color: "Navy Heritage", stock: 0 },
      { size: "8Y", color: "Navy Heritage", stock: 0 },
      { size: "10Y", color: "Navy Heritage", stock: 0 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Raw denim chore jacket built on a heritage silhouette, made to be handed down.",
    rating: 5,
    reviews: 22,
  },
  {
    _id: "p9",
    name: "Loom Trousers",
    price: 120,
    collection: "Linen Essentials",
    category: "Boys",
    type: "Trousers",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: [{ name: "Stone", hex: "#DCD4C5" }],
    variants: [
      { size: "2Y", color: "Stone", stock: 5 },
      { size: "4Y", color: "Stone", stock: 4 },
      { size: "6Y", color: "Stone", stock: 6 },
      { size: "8Y", color: "Stone", stock: 3 },
      { size: "10Y", color: "Stone", stock: 1 },
      { size: "12Y", color: "Stone", stock: 2 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Relaxed fit trousers in undyed stone linen.",
    rating: 4,
    reviews: 6,
  },
  {
    _id: "p10",
    name: "Sunfield Canvas Jacket",
    price: 158,
    collection: "Playwear Edit",
    category: "Boys",
    type: "Jacket",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [{ name: "Yellow", hex: "#D9A441" }],
    variants: [
      { size: "2Y", color: "Yellow", stock: 5 },
      { size: "4Y", color: "Yellow", stock: 0 },
      { size: "6Y", color: "Yellow", stock: 3 },
      { size: "8Y", color: "Yellow", stock: 2 },
    ],
    images: ["/src/assets/hero.png"],
    description: "A sun-bright canvas jacket with brass hardware, built for muddy boots and bright afternoons.",
    rating: 5,
    reviews: 5,
    isNew: true,
  },
  {
    _id: "p11",
    name: "Bramble Corduroy Trousers",
    price: 132,
    collection: "Playwear Edit",
    category: "Girls",
    type: "Trousers",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [{ name: "Red", hex: "#B23A3A" }],
    variants: [
      { size: "2Y", color: "Red", stock: 4 },
      { size: "4Y", color: "Red", stock: 6 },
      { size: "6Y", color: "Red", stock: 0 },
      { size: "8Y", color: "Red", stock: 3 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Wide-wale corduroy trousers in a warm berry red, cut for room to run.",
    rating: 5,
    reviews: 4,
  },
  {
    _id: "p12",
    name: "Portside Canvas Shorts",
    price: 74,
    collection: "Linen Essentials",
    category: "Boys",
    type: "Shorts",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: [{ name: "Stone", hex: "#DCD4C5" }],
    variants: [
      { size: "2Y", color: "Stone", stock: 5 },
      { size: "4Y", color: "Stone", stock: 0 },
      { size: "6Y", color: "Stone", stock: 3 },
      { size: "8Y", color: "Stone", stock: 2 },
    ],
    images: ["/src/assets/hero.png"],
    description: "Durable canvas shorts with a soft brushed lining, made for tide pools and tree climbing alike.",
    rating: 4,
    reviews: 8,
  },
  {
    _id: "p13",
    name: "Meadow Poplin Shirt",
    price: 78,
    collection: "Latest Arrivals",
    category: "Girls",
    type: "Shirt",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: [{ name: "Ivory", hex: "#F0EBDD" }],
    variants: [
      { size: "2Y", color: "Ivory", stock: 0 },
      { size: "4Y", color: "Ivory", stock: 5 },
      { size: "6Y", color: "Ivory", stock: 3 },
      { size: "8Y", color: "Ivory", stock: 4 },
      { size: "10Y", color: "Ivory", stock: 0 },
      { size: "12Y", color: "Ivory", stock: 2 },
    ],
    images: ["/src/assets/hero.png"],
    description: "A crisp cotton poplin shirt with mother-of-pearl buttons, equally at home at the table or the park.",
    rating: 5,
    reviews: 6,
  },
];

export const getProductById = (id) => products.find((p) => p._id === id);

// Stock for one specific size+color combination. 0 if not found.
export const getVariantStock = (product, size, color) => {
  const variant = product.variants?.find((v) => v.size === size && v.color === color);
  return variant ? variant.stock : 0;
};

// True only when every size/color combination is at 0.
export const isProductSoldOut = (product) =>
  !product.variants || product.variants.every((v) => v.stock === 0);

// Colors that still have at least one size in stock.
export const getAvailableColors = (product) => {
  if (!product.variants) return product.colors?.map((c) => c.name) || [];
  const inStock = new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.color));
  return [...inStock];
};

// Sizes still in stock for a given color.
export const getAvailableSizesForColor = (product, color) => {
  if (!product.variants) return product.sizes || [];
  return product.variants.filter((v) => v.color === color && v.stock > 0).map((v) => v.size);
};

// Products belonging to one category. "All" (or no category) returns everything.
export const getProductsByCategory = (category) => {
  if (!category || category === "All") return products;
  return products.filter((p) => p.category === category);
};

// ---- Search ----
// Understands garment types ("jacket(s)", "trousers/pants", "shorts", "shirt(s)",
// "tank", "cami", "skirt(s)", "set(s)/ensemble"), gender words ("boy(s)"/"girl(s)"),
// and falls back to plain substring matching on name/description/collection/color
// for anything else (colors like "red", "yellow", "black" work this way).

const STOPWORDS = new Set(["for", "in", "with", "the", "a", "an", "of", "and", "on"]);

const TYPE_ALIASES = {
  jacket: ["jacket"],
  jackets: ["jacket"],
  trouser: ["trousers"],
  trousers: ["trousers"],
  pant: ["trousers"],
  pants: ["trousers"],
  short: ["shorts"],
  shorts: ["shorts"],
  shirt: ["shirt", "tank", "cami"],
  shirts: ["shirt", "tank", "cami"],
  tank: ["tank"],
  tanks: ["tank"],
  cami: ["cami"],
  camis: ["cami"],
  skirt: ["skirt"],
  skirts: ["skirt"],
  set: ["set"],
  sets: ["set"],
  ensemble: ["set"],
  ensembles: ["set"],
};

const GENDER_ALIASES = {
  boy: "Boys",
  boys: "Boys",
  girl: "Girls",
  girls: "Girls",
};

const tokenMatchesProduct = (token, product) => {
  const t = token.toLowerCase();

  const aliasTypes = TYPE_ALIASES[t];
  if (aliasTypes && aliasTypes.includes(product.type?.toLowerCase())) return true;

  const aliasGender = GENDER_ALIASES[t];
  if (aliasGender && product.category === aliasGender) return true;

  const haystack = [
    product.name,
    product.type,
    product.category,
    product.collection,
    product.description,
    ...(product.colors?.map((c) => c.name) || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(t);
};

export const searchProducts = (list, query) => {
  const q = (query || "").trim().toLowerCase();
  if (!q) return list;

  const tokens = q.split(/\s+/).filter((tok) => tok && !STOPWORDS.has(tok));
  if (tokens.length === 0) return list;

  return list.filter((product) => tokens.every((token) => tokenMatchesProduct(token, product)));
};