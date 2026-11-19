import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to run the demo seed in production (NODE_ENV=production).");
  process.exit(1);
}

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    handle: "kestrel-14-ultrabook",
    title: "Kestrel 14 Ultrabook",
    price: 1199,
    compare: 1399,
    category: "Laptops",
    brand: "Kestrel",
    spec: "14in 2.8K OLED · 16GB · 1TB",
    rating: 4.6,
    reviews: 218,
    finishes: ["Graphite", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "kestrel-16-studio",
    title: "Kestrel 16 Studio",
    price: 1849,
    compare: null,
    category: "Laptops",
    brand: "Kestrel",
    spec: "16in mini-LED · 32GB · 2TB",
    rating: 4.7,
    reviews: 142,
    finishes: ["Graphite", "Midnight"],
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "nord-flex-convertible",
    title: "Nord Flex Convertible",
    price: 899,
    compare: 1050,
    category: "Laptops",
    brand: "Nord",
    spec: "13in touch · 16GB · 512GB",
    rating: 4.2,
    reviews: 96,
    finishes: ["Silver", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "nord-air-13",
    title: "Nord Air 13",
    price: 749,
    compare: null,
    category: "Laptops",
    brand: "Nord",
    spec: "13in 2.5K · 16GB · 512GB",
    rating: 4.4,
    reviews: 173,
    finishes: ["Silver", "White"],
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "kestrel-15-everyday",
    title: "Kestrel 15 Everyday",
    price: 649,
    compare: 749,
    category: "Laptops",
    brand: "Kestrel",
    spec: "15in FHD+ · 16GB · 512GB",
    rating: 4.1,
    reviews: 258,
    finishes: ["Steel", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "meridian-over-ear",
    title: "Meridian Studio Over-Ear",
    price: 329,
    compare: 399,
    category: "Audio",
    brand: "Meridian",
    spec: "40h battery · ANC",
    rating: 4.5,
    reviews: 526,
    finishes: ["Midnight", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "meridian-lite",
    title: "Meridian Lite On-Ear",
    price: 149,
    compare: null,
    category: "Audio",
    brand: "Meridian",
    spec: "28h battery · fold flat",
    rating: 4.2,
    reviews: 311,
    finishes: ["Crimson", "Midnight"],
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "meridian-buds-pro",
    title: "Meridian Buds Pro",
    price: 179,
    compare: null,
    category: "Audio",
    brand: "Meridian",
    spec: "8h + 24h case · ANC",
    rating: 4.4,
    reviews: 733,
    finishes: ["White", "Midnight"],
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "nord-mech-75",
    title: "Nord Mechanical 75",
    price: 139,
    compare: null,
    category: "Keyboards & mice",
    brand: "Nord",
    spec: "75% · hot-swap · wireless",
    rating: 4.6,
    reviews: 341,
    finishes: ["Graphite", "White"],
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "nord-mech-colour",
    title: "Nord Mechanical Colour",
    price: 159,
    compare: 189,
    category: "Keyboards & mice",
    brand: "Nord",
    spec: "65% · gasket mount · RGB",
    rating: 4.7,
    reviews: 204,
    finishes: ["Sand", "Steel"],
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "nord-slim-board",
    title: "Nord Slim Board",
    price: 89,
    compare: null,
    category: "Keyboards & mice",
    brand: "Nord",
    spec: "Low profile · BT + 2.4GHz",
    rating: 4.0,
    reviews: 148,
    finishes: ["White", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "nord-precision-mouse",
    title: "Nord Precision Mouse",
    price: 79,
    compare: 95,
    category: "Keyboards & mice",
    brand: "Nord",
    spec: "26K DPI · 70h · 58g",
    rating: 4.5,
    reviews: 297,
    finishes: ["Midnight", "White"],
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  },
  {
    handle: "kestrel-27-monitor",
    title: "Kestrel 27 4K Monitor",
    price: 549,
    compare: 649,
    category: "Desktops & displays",
    brand: "Kestrel",
    spec: "27in 4K · 144Hz · USB-C",
    rating: 4.4,
    reviews: 209,
    finishes: ["Silver", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "torus-tower-rx",
    title: "Torus Tower RX",
    price: 1299,
    compare: null,
    category: "Desktops & displays",
    brand: "Torus",
    spec: "8-core · 32GB · 2TB · RTX",
    rating: 4.6,
    reviews: 118,
    finishes: ["Midnight"],
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "torus-vision-headset",
    title: "Torus Vision Headset",
    price: 399,
    compare: 459,
    category: "Desktops & displays",
    brand: "Torus",
    spec: "2160x2160 per eye · 120Hz",
    rating: 4.3,
    reviews: 262,
    finishes: ["Midnight", "Steel"],
    images: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80"
    ],
    featured: false
  }
];

const CATEGORIES = [
  { name: "Laptops", slug: "laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80" },
  { name: "Audio", slug: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" },
  { name: "Keyboards & mice", slug: "keyboards-mice", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80" },
  { name: "Desktops & displays", slug: "desktops-displays", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80" }
];

async function main() {
  console.log("Seeding demo catalog with non-destructive upserts...");

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, image: category.image },
      create: category
    });
  }

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { handle: product.handle },
      update: product,
      create: product
    });
  }

  console.log(`Demo catalog ready: ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
