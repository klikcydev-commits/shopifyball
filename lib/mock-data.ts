import type { Product, Collection, KitStyle } from "./shopify-types"

export const products: Product[] = [
  {
    id: "prod_1",
    title: "LEMAH Grip Socks — White Trim",
    handle: "grip-socks-white-trim",
    description:
      "Engineered grip technology for maximum control. Premium cotton blend with anti-slip silicone patterns.",
    images: [{ id: "img_1", url: "/premium-white-grip-socks-football-minimal.jpg", altText: "Grip Socks White", width: 600, height: 600 }],
    price: "24.00",
    tags: ["socks", "grip", "match-day"],
    variants: [
      {
        id: "var_1_1",
        title: "S",
        price: "24.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "S" }],
      },
      {
        id: "var_1_2",
        title: "M",
        price: "24.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "M" }],
      },
      {
        id: "var_1_3",
        title: "L",
        price: "24.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "L" }],
      },
    ],
    availableForSale: true,
    category: "Socks & Grip",
  },
  {
    id: "prod_2",
    title: "LEMAH Carry Duffel — Navy Core",
    handle: "carry-duffel-navy-core",
    description:
      "Premium travel companion. Water-resistant fabric with gold hardware accents. Multiple compartments for organization.",
    images: [{ id: "img_2", url: "/premium-navy-duffel-bag-gold-zipper-minimal.jpg", altText: "Carry Duffel Navy", width: 600, height: 600 }],
    price: "145.00",
    compareAtPrice: "165.00",
    tags: ["bags", "travel", "navy-core"],
    variants: [
      {
        id: "var_2_1",
        title: "One Size",
        price: "145.00",
        compareAtPrice: "165.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One Size" }],
      },
    ],
    availableForSale: true,
    category: "Bags & Carry",
  },
  {
    id: "prod_3",
    title: "LEMAH Match Day Pouch — Gold Zip",
    handle: "match-day-pouch-gold-zip",
    description:
      "Compact essentials carrier. Soft-touch exterior with premium gold zipper. Perfect for match day rituals.",
    images: [{ id: "img_3", url: "/premium-pouch-gold-zipper-white-leather-minimal.jpg", altText: "Match Day Pouch", width: 600, height: 600 }],
    price: "38.00",
    tags: ["accessories", "match-day", "gold-detail"],
    variants: [
      {
        id: "var_3_1",
        title: "White",
        price: "38.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
      },
      {
        id: "var_3_2",
        title: "Navy",
        price: "38.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Navy" }],
      },
    ],
    availableForSale: true,
    category: "Bags & Carry",
  },
  {
    id: "prod_4",
    title: "LEMAH Scarf — Stadium Night",
    handle: "scarf-stadium-night",
    description: "Woven heritage meets modern design. Double-sided navy and white with subtle gold threading.",
    images: [
      { id: "img_4", url: "/premium-football-scarf-navy-white-gold-minimal.jpg", altText: "Stadium Night Scarf", width: 600, height: 600 },
    ],
    price: "55.00",
    tags: ["accessories", "scarf", "stadium"],
    variants: [
      {
        id: "var_4_1",
        title: "One Size",
        price: "55.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One Size" }],
      },
    ],
    availableForSale: true,
    category: "Headwear",
  },
  {
    id: "prod_5",
    title: "LEMAH Cap — Clean Crest",
    handle: "cap-clean-crest",
    description: "Structured six-panel cap with embroidered LEMAH crest. Adjustable strap with gold clasp.",
    images: [{ id: "img_5", url: "/premium-white-baseball-cap-gold-embroidery-minimal.jpg", altText: "Clean Crest Cap", width: 600, height: 600 }],
    price: "42.00",
    tags: ["headwear", "cap", "white-night"],
    variants: [
      {
        id: "var_5_1",
        title: "White",
        price: "42.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
      },
      {
        id: "var_5_2",
        title: "Navy",
        price: "42.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Navy" }],
      },
    ],
    availableForSale: true,
    category: "Headwear",
  },
  {
    id: "prod_6",
    title: "LEMAH Bottle — Frost White",
    handle: "bottle-frost-white",
    description: "Insulated stainless steel. Keeps cold for 24 hours. Minimal LEMAH branding with matte finish.",
    images: [
      { id: "img_6", url: "/premium-white-water-bottle-stainless-steel-minimal.jpg", altText: "Frost White Bottle", width: 600, height: 600 },
    ],
    price: "32.00",
    tags: ["essentials", "bottle", "white-night"],
    variants: [
      {
        id: "var_6_1",
        title: "500ml",
        price: "32.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "500ml" }],
      },
      {
        id: "var_6_2",
        title: "750ml",
        price: "38.00",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "750ml" }],
      },
    ],
    availableForSale: true,
    category: "Bottles & Essentials",
  },
  {
    id: "prod_7",
    title: "LEMAH Travel Organizer — Eleven System",
    handle: "travel-organizer-eleven",
    description: "The complete match day organization system. Multiple zip compartments with tactical layout.",
    images: [
      { id: "img_7", url: "/premium-travel-organizer-pouch-navy-gold-minimal.jpg", altText: "Eleven System Organizer", width: 600, height: 600 },
    ],
    price: "68.00",
    tags: ["travel", "organizer", "11kit"],
    variants: [
      {
        id: "var_7_1",
        title: "Navy",
        price: "68.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Navy" }],
      },
    ],
    availableForSale: true,
    category: "Bags & Carry",
  },
  {
    id: "prod_8",
    title: "LEMAH Keychain — Mini Pitch",
    handle: "keychain-mini-pitch",
    description: "Precision-cast metal keychain featuring a miniature tactical pitch design. Gold plated details.",
    images: [
      { id: "img_8", url: "/premium-gold-keychain-football-pitch-design-minima.jpg", altText: "Mini Pitch Keychain", width: 600, height: 600 },
    ],
    price: "18.00",
    tags: ["collectibles", "keychain", "gold-detail"],
    variants: [
      {
        id: "var_8_1",
        title: "Gold",
        price: "18.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Gold" }],
      },
    ],
    availableForSale: true,
    category: "Collectibles",
  },
  {
    id: "prod_9",
    title: "LEMAH Wristband Set — Match Ready",
    handle: "wristband-match-ready",
    description: "Set of two performance wristbands. Moisture-wicking fabric with embroidered LEMAH mark.",
    images: [
      { id: "img_9", url: "/premium-white-wristbands-sports-minimal.jpg", altText: "Match Ready Wristbands", width: 600, height: 600 },
    ],
    price: "16.00",
    tags: ["accessories", "wristband", "match-day"],
    variants: [
      {
        id: "var_9_1",
        title: "White",
        price: "16.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
      },
      {
        id: "var_9_2",
        title: "Navy",
        price: "16.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Navy" }],
      },
    ],
    availableForSale: true,
    category: "Match Day Kits",
  },
  {
    id: "prod_10",
    title: "LEMAH Headband — Tunnel Focus",
    handle: "headband-tunnel-focus",
    description: "Wide performance headband for tunnel walk confidence. Anti-slip silicone grip interior.",
    images: [
      { id: "img_10", url: "/premium-black-headband-sports-minimal.jpg", altText: "Tunnel Focus Headband", width: 600, height: 600 },
    ],
    price: "22.00",
    tags: ["headwear", "headband", "performance"],
    variants: [
      {
        id: "var_10_1",
        title: "Black",
        price: "22.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Black" }],
      },
      {
        id: "var_10_2",
        title: "White",
        price: "22.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
      },
    ],
    availableForSale: true,
    category: "Headwear",
  },
  {
    id: "prod_11",
    title: "LEMAH Phone Case — Pitch Lines",
    handle: "phone-case-pitch-lines",
    description: "Tactical pitch pattern case with shock-absorbing corners. Available for latest models.",
    images: [
      { id: "img_11", url: "/premium-phone-case-football-pitch-pattern-white-mi.jpg", altText: "Pitch Lines Phone Case", width: 600, height: 600 },
    ],
    price: "35.00",
    tags: ["accessories", "phone-case", "tactical"],
    variants: [
      {
        id: "var_11_1",
        title: "iPhone 15",
        price: "35.00",
        availableForSale: true,
        selectedOptions: [{ name: "Model", value: "iPhone 15" }],
      },
      {
        id: "var_11_2",
        title: "iPhone 15 Pro",
        price: "35.00",
        availableForSale: true,
        selectedOptions: [{ name: "Model", value: "iPhone 15 Pro" }],
      },
    ],
    availableForSale: true,
    category: "Collectibles",
  },
  {
    id: "prod_12",
    title: "LEMAH Training Journal — Tactics",
    handle: "training-journal-tactics",
    description: "Premium bound journal with pitch diagrams and goal-tracking pages. Gold foil LEMAH emboss.",
    images: [
      { id: "img_12", url: "/premium-notebook-journal-navy-gold-embossed-minima.jpg", altText: "Tactics Training Journal", width: 600, height: 600 },
    ],
    price: "28.00",
    tags: ["essentials", "journal", "training"],
    variants: [
      {
        id: "var_12_1",
        title: "Navy",
        price: "28.00",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Navy" }],
      },
    ],
    availableForSale: true,
    category: "Bottles & Essentials",
  },
]

export const collections: Collection[] = [
  {
    id: "col_1",
    title: "White Night",
    handle: "white-night",
    description: "Clean. Minimal. Bright. The essence of match day purity.",
    image: {
      id: "col_img_1",
      url: "/premium-white-minimalist-football-accessories-coll.jpg",
      altText: "White Night Collection",
      width: 600,
      height: 800,
    },
    products: products.filter((p) => p.tags.includes("white-night") || p.title.toLowerCase().includes("white")),
  },
  {
    id: "col_2",
    title: "Navy Core",
    handle: "navy-core",
    description: "Deep. Understated. Stealth mode for the focused.",
    image: {
      id: "col_img_2",
      url: "/premium-navy-blue-football-accessories-collection.jpg",
      altText: "Navy Core Collection",
      width: 600,
      height: 800,
    },
    products: products.filter((p) => p.tags.includes("navy-core") || p.title.toLowerCase().includes("navy")),
  },
  {
    id: "col_3",
    title: "Gold Detail",
    handle: "gold-detail",
    description: "Premium accents. Limited pieces. The finishing touch.",
    image: {
      id: "col_img_3",
      url: "/premium-gold-accent-football-accessories-collectio.jpg",
      altText: "Gold Detail Collection",
      width: 600,
      height: 800,
    },
    products: products.filter((p) => p.tags.includes("gold-detail") || p.title.toLowerCase().includes("gold")),
  },
]

export const kitStyles: KitStyle[] = [
  {
    id: "kit_1",
    name: "White Night",
    description: "Clean, minimal, bright. For those who arrive in light.",
    colorScheme: "white",
    products: products.slice(0, 6),
  },
  {
    id: "kit_2",
    name: "Navy Core",
    description: "Deep, understated, stealth. Focus mode activated.",
    colorScheme: "navy",
    products: products.slice(3, 9),
  },
  {
    id: "kit_3",
    name: "Gold Detail",
    description: "Premium accents, limited drops. The finishing touch.",
    colorScheme: "gold",
    products: products.slice(6, 12),
  },
]

export const testimonials = [
  {
    id: 1,
    name: "Marcus T.",
    location: "London",
    text: "The grip socks changed everything. Pure control, pure comfort.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sofia R.",
    location: "Barcelona",
    text: "Finally, accessories that match the lifestyle. LEMAH gets it.",
    rating: 5,
  },
  {
    id: 3,
    name: "James K.",
    location: "Manchester",
    text: "The 11Kit is genius. Everything I need, curated perfectly.",
    rating: 5,
  },
  {
    id: 4,
    name: "Elena V.",
    location: "Milan",
    text: "Quality you can feel. These are the details that matter.",
    rating: 5,
  },
  {
    id: 5,
    name: "Carlos M.",
    location: "Madrid",
    text: "Stadium to street, this brand understands the culture.",
    rating: 5,
  },
  {
    id: 6,
    name: "Anna P.",
    location: "Munich",
    text: "The duffel is my match day essential now. Perfect size, perfect look.",
    rating: 5,
  },
  {
    id: 7,
    name: "David L.",
    location: "Paris",
    text: "Premium without being flashy. Exactly what I was looking for.",
    rating: 5,
  },
  {
    id: 8,
    name: "Nina S.",
    location: "Amsterdam",
    text: "Love the attention to detail. The gold accents are chef's kiss.",
    rating: 5,
  },
]

export const faqs = [
  {
    id: 1,
    question: "What is the 11Kit?",
    answer:
      "The 11Kit is our curated selection of 11 essential accessories for match day, travel, and street style. Each kit is designed around a theme and can be customized to your preferences.",
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout. Free shipping on orders over €75.",
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer:
      "We offer 30-day returns on all unworn items with original tags. Simply initiate a return through your account or contact support.",
  },
  {
    id: 4,
    question: "Can I customize my 11Kit?",
    answer:
      "Yes! The 11Kit page allows you to swap items within each slot category. Build your perfect match day setup.",
  },
  {
    id: 5,
    question: "Do you offer gift packaging?",
    answer:
      "Yes, premium gift packaging is available at checkout. Each gift box includes tissue paper, a LEMAH ribbon, and a personalized note card.",
  },
  {
    id: 6,
    question: "Are the products officially licensed?",
    answer:
      "LEMAH is an independent accessories brand. We do not use any official club logos or licensed imagery. Our designs celebrate football culture universally.",
  },
  {
    id: 7,
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 50 countries. International shipping rates are calculated at checkout based on location.",
  },
  {
    id: 8,
    question: "How do I track my order?",
    answer:
      "Once shipped, you'll receive an email with tracking information. You can also track your order through your account dashboard.",
  },
]

export const categories = [
  { id: "cat_1", name: "Socks & Grip", icon: "sock", href: "#socks" },
  { id: "cat_2", name: "Bags & Carry", icon: "briefcase", href: "#bags" },
  { id: "cat_3", name: "Headwear", icon: "hard-hat", href: "#headwear" },
  { id: "cat_4", name: "Match Day Kits", icon: "package", href: "#kits" },
  { id: "cat_5", name: "Bottles & Essentials", icon: "glass-water", href: "#essentials" },
  { id: "cat_6", name: "Collectibles", icon: "gem", href: "#collectibles" },
]
