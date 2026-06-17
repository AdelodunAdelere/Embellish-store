import { Product } from "@/types";

export const products: Product[] = [
  // ── TOTE BAGS ──────────────────────────────────────────
  {
    id: "1",
    name: "Sienna Structured Tote",
    slug: "sienna-structured-tote",
    price: 28500,
    category: "tote",
    description:
      "A timeless structured tote crafted in premium vegan leather. Spacious enough for everything you need, elegant enough for every occasion.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Tote%20Bags/2.JPG"],
    colors: ["#5F4842", "#260C1A", "#AF8D86"],
    badge: "new",
    rating: 5,
    reviews: 42,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Noir Oversized Tote",
    slug: "noir-oversized-tote",
    price: 34500,
    category: "tote",
    description:
      "A bold oversized silhouette in deep plum leather. Roomy interior with gold hardware accents.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Tote%20Bags/1.JPG"],
    colors: ["#260C1A", "#432E36"],
    badge: "bestseller",
    rating: 5,
    reviews: 61,
    inStock: true,
  },

  // ── HANDBAGS ───────────────────────────────────────────
  {
    id: "3",
    name: "Blush Satin Handbag",
    slug: "blush-satin-handbag",
    price: 27000,
    category: "handbag",
    description:
      "A dreamy satin handbag in our signature blush. Top handle with optional crossbody strap.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/1.JPG"],
    colors: ["#EDBFC6", "#AF8D86"],
    rating: 4.5,
    reviews: 35,
    inStock: true,
  },
  {
    id: "4",
    name: "Enveloped Leather Handbag",
    slug: "enveloped-leather-handbag",
    price: 22500,
    originalPrice: 30000,
    category: "handbag",
    description:
      "A sleek leather handbag with an enveloped silhouette. Features a top handle and detachable crossbody strap for versatile styling.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/2.JPG"],
    colors: ["#EDBFC6", "#AF8D86"],
    badge: "sale",
    rating: 4.5,
    reviews: 35,
    inStock: true,
  },
  {
    id: "5",
    name: "Satchel Leather Handbag",
    slug: "satchel-leather-handbag",
    price: 21500,
    originalPrice: 27000,
    category: "handbag",
    description:
      " A stunning satchel leather handbag in our signature blush. Top handle with optional crossbody strap.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/3.JPG"],
    colors: ["#EDBFC6", "#AF8D86"],
    badge: "sale",
    rating: 4.5,
    reviews: 35,
    inStock: true,
  },
  {
    id: "6",
    name: "knotted leather handbag",
    slug: "knotted-leather-handbag",
    price: 23500,
    category: "handbag",
    description:
      "Knotted leather handbag in a soft blush hue. Features a unique handle design and a spacious interior for all your essentials.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/4.JPG"],
    colors: ["#EDBFC6", "#AF8D86"],
    rating: 4.5,
    reviews: 35,
    inStock: true,
  },



  // ── CLUTCHES ───────────────────────────────────────────
  {
    id: "7",
    name: "Amber Mini Clutch",
    slug: "amber-mini-clutch",
    price: 19000,
    originalPrice: 24000,
    category: "clutch",
    description:
      "A sleek mini clutch with a magnetic closure and detachable chain strap. Day to night versatility.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Clutch/1.JPG"],
    colors: ["#C4956A", "#260C1A", "#EDBFC6"],
    badge: "sale",
    rating: 5,
    reviews: 29,
    inStock: true,
    featured: true,
  },

  // ── JEWELLERY ──────────────────────────────────────────
  {
    id: "8",
    name: "Pearl Drop Earring Set",
    slug: "pearl-drop-earring-set",
    price: 9600,
    originalPrice: 12000,
    category: "jewellery",
    description:
      "Delicate freshwater pearls suspended in gold-tone settings. The perfect finishing touch for any look.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Jewellery/3.jpeg"],
    colors: ["#F5F5F0", "#E8C89A"],
    badge: "sale",
    rating: 4.5,
    reviews: 38,
    inStock: true,
    featured: true,
  },
  {
    id: "9",
    name: "Gold Layered Cuff",
    slug: "gold-layered-cuff",
    price: 7200,
    category: "jewellery",
    description:
      "Three-layer gold-tone cuff that stacks beautifully or shines alone. Adjustable for a perfect fit.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Jewellery/2.jpeg"],
    colors: ["#E8C89A"],
    badge: "new",
    rating: 4,
    reviews: 22,
    inStock: true,
  },

  // ── HEADBANDS ──────────────────────────────────────────
  {
    id: "10",
    name: "Velvet Ribbed Headband",
    slug: "velvet-ribbed-headband",
    price: 6500,
    category: "headbands",
    description:
      "Ultra-soft ribbed velvet headband in a flattering fitted silhouette. Available in our signature palette.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Headbands/2.webp"],
    colors: ["#260C1A", "#432E36", "#EDBFC6", "#AF8D86"],
    badge: "new",
    rating: 4.5,
    reviews: 17,
    inStock: true,
    featured: true,
  },
  {
    id: "11",
    name: "Caramel Knit Headband",
    slug: "caramel-knit-headband",
    price: 5800,
    category: "headbands",
    description:
      "Cosy chunky-knit headband with a classic silhouette. A wardrobe staple in warm caramel tones.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Headbands/1.webp"],
    colors: ["#C4956A", "#5F4842", "#260C1A"],
    rating: 5,
    reviews: 14,
    inStock: true,
  },

  // ── LIPGLOSS ──────────────────────────────────────────
  {
    id: "12",
    name: "Rose Gold Lipgloss",
    slug: "rose-gold-lipgloss",
    price: 4500,
    category: "lipgloss",
    description:
      "A shimmering rose gold lipgloss that delivers high shine and a hint of color. Perfect for a natural, radiant look.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Lipgloss/1.jpeg"],
    colors: ["#E8C89A", "#EDBFC6"],
    rating: 4.5,
    reviews: 12,
    inStock: true,
  },
  {
    id: "13",
    name: "Clear Gloss",
    slug: "clear-gloss",
    price: 3500,
    category: "lipgloss",
    description:
      "A crystal-clear lipgloss that provides a glossy finish and long-lasting hydration. Ideal for layering or wearing alone for a natural shine.",
    images: ["https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Lipgloss/2.webp"],
    colors: ["#F5F5F0"],
    rating: 4,
    reviews: 8,
    inStock: true,
  },
];

export const categories = [
  { id: "all", label: "All" },
  { id: "handbag", label: "Handbags" },
  { id: "tote", label: "Tote Bags" },
  { id: "clutch", label: "Clutches" },
  { id: "jewellery", label: "Jewellery" },
  { id: "headbands", label: "Headbands" },
  {id: "lipgloss", label: "Lipgloss" },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("NGN", "₦");
};
