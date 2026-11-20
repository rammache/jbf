import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV?.trim() === "production") {
  console.error("Refusing to run the demo seed in production (NODE_ENV=production).");
  process.exit(1);
}

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    handle: "kestrel-14-ultrabook",
    title: "Kestrel 14 Ultrabook",
    price: 11999,
    compare: 13999,
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
    price: 18499,
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
    price: 8999,
    compare: 10500,
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
    price: 7499,
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
    price: 6499,
    compare: 7499,
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
    price: 3299,
    compare: 3999,
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
    price: 1499,
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
    price: 1799,
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
    price: 1390,
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
    price: 1590,
    compare: 1890,
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
    price: 890,
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
    price: 790,
    compare: 950,
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
    price: 5490,
    compare: 6490,
    category: "Desktops & displays",
    brand: "Kestrel",
    spec: "27in 4K · 144Hz · USB-C",
    rating: 4.4,
    reviews: 209,
    finishes: ["Silver", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585770000000-f7347c490ee2?auto=format&fit=crop&w=900&q=80"
    ],
    featured: true
  },
  {
    handle: "torus-tower-rx",
    title: "Torus Tower RX",
    price: 12999,
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
    price: 3990,
    compare: 4590,
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
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops and mobile workstations.",
    image: null,
    sortOrder: 1,
    isActive: true
  },
  {
    name: "Audio",
    slug: "audio",
    description: "Studio monitors, reference headphones, and sound accessories.",
    image: null,
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Keyboards & mice",
    slug: "keyboards-mice",
    description: "Precision mechanical keyboards and ergonomic pointing devices.",
    image: null,
    sortOrder: 3,
    isActive: true
  },
  {
    name: "Desktops & displays",
    slug: "desktops-displays",
    description: "Pro desktop towers and calibrated high-resolution displays.",
    image: null,
    sortOrder: 4,
    isActive: true
  }
];

async function main() {
  console.log("Seeding demo catalog with non-destructive upserts...");

  const categoryMap = new Map<string, number>();

  for (const category of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
        sortOrder: category.sortOrder,
        isActive: category.isActive
      },
      create: category
    });
    categoryMap.set(saved.name, saved.id);
  }

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const { category: categoryName, ...rest } = product;
    const categoryId = categoryMap.get(categoryName);
    if (!categoryId) {
      throw new Error(`Category "${categoryName}" not found for product "${product.title}"`);
    }

    const sku = `JBF-${String(i + 1).padStart(3, "0")}-${product.handle.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase()}`;

    await prisma.product.upsert({
      where: { handle: product.handle },
      update: {
        ...rest,
        categoryId,
        isFeatured: rest.featured ?? false,
        isActive: true,
        isArchived: false,
        stock: 25,
        lowStockThreshold: 5,
        condition: "NEW",
        sku,
        description: `Official authentic ${product.title} from Jabour Phone. Full manufacturer warranty, guaranteed authentic with fast delivery.`
      },
      create: {
        ...rest,
        categoryId,
        isFeatured: rest.featured ?? false,
        isActive: true,
        isArchived: false,
        stock: 25,
        lowStockThreshold: 5,
        condition: "NEW",
        sku,
        description: `Official authentic ${product.title} from Jabour Phone. Full manufacturer warranty, guaranteed authentic with fast delivery.`
      }
    });
  }

  console.log(`Demo catalog ready: ${CATEGORIES.length} categories and ${PRODUCTS.length} products.`);

  // Seed sample demo orders for admin order management testing
  console.log("Seeding demo customer orders...");
  const sampleProduct = await prisma.product.findFirst({
    where: { handle: "kestrel-14-ultrabook" }
  });
  const sampleProduct2 = await prisma.product.findFirst({
    where: { handle: "nord-flex-convertible" }
  });

  if (sampleProduct) {
    const demoOrders = [
      {
        orderNumber: "JP-2611-1001",
        customerName: "Michel Aoun",
        customerEmail: "michel.aoun@example.com",
        customerPhone: "+961 71 234 567",
        customerAddress: "Sassine Square, Building 14, 3rd Floor",
        city: "Beirut",
        notes: "Please call 15 minutes before arrival.",
        paymentMethod: "COD",
        subtotal: sampleProduct.price,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct.price,
        status: "PENDING" as const,
        items: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            selectedFinish: "Graphite",
            quantity: 1,
            price: sampleProduct.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-1002",
        customerName: "Sarah Khoury",
        customerEmail: "sarah.khoury@example.com",
        customerPhone: "+961 76 987 654",
        customerAddress: "Mina Road, Near Port Entrance",
        city: "Tripoli",
        notes: "Leave with building concierge if not home.",
        paymentMethod: "COD",
        subtotal: sampleProduct2 ? sampleProduct2.price : 899,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct2 ? sampleProduct2.price : 899,
        status: "CONFIRMED" as const,
        items: [
          {
            productId: sampleProduct2?.id || sampleProduct.id,
            productTitle: sampleProduct2?.title || sampleProduct.title,
            selectedFinish: "Silver",
            quantity: 1,
            price: sampleProduct2 ? sampleProduct2.price : 899
          }
        ]
      },
      {
        orderNumber: "JP-2611-1003",
        customerName: "Georges Haddad",
        customerEmail: "georges.haddad@example.com",
        customerPhone: "+961 03 456 789",
        customerAddress: "Old Souk, Sea View Street",
        city: "Jounieh",
        paymentMethod: "COD",
        subtotal: sampleProduct.price,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct.price,
        status: "PROCESSING" as const,
        items: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            selectedFinish: "Silver",
            quantity: 1,
            price: sampleProduct.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-1004",
        customerName: "Nour Mansour",
        customerEmail: "nour.mansour@example.com",
        customerPhone: "+961 70 555 444",
        customerAddress: "Riad El Solh Boulevard",
        city: "Saida",
        paymentMethod: "COD",
        subtotal: sampleProduct.price,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct.price,
        status: "SHIPPED" as const,
        items: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            selectedFinish: "Graphite",
            quantity: 1,
            price: sampleProduct.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-1005",
        customerName: "Ziad Rahbani",
        customerEmail: "ziad.rahbani@example.com",
        customerPhone: "+961 71 888 999",
        customerAddress: "Hamra Main Street, Apartment 5B",
        city: "Beirut",
        paymentMethod: "COD",
        subtotal: sampleProduct.price,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct.price,
        status: "DELIVERED" as const,
        items: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            selectedFinish: "Graphite",
            quantity: 1,
            price: sampleProduct.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-1006",
        customerName: "Elie Saab",
        customerEmail: "elie.saab@example.com",
        customerPhone: "+961 03 111 222",
        customerAddress: "Harbor Road, Villa 3",
        city: "Byblos",
        notes: "Customer cancelled prior to dispatch.",
        paymentMethod: "COD",
        subtotal: sampleProduct.price,
        shippingFee: 0,
        tax: 0,
        totalAmount: sampleProduct.price,
        status: "CANCELLED" as const,
        items: [
          {
            productId: sampleProduct.id,
            productTitle: sampleProduct.title,
            selectedFinish: "Graphite",
            quantity: 1,
            price: sampleProduct.price
          }
        ]
      }
    ];

    for (const orderData of demoOrders) {
      const { items, ...orderHeader } = orderData;
      const existing = await prisma.order.findUnique({
        where: { orderNumber: orderHeader.orderNumber }
      });

      if (!existing) {
        await prisma.order.create({
          data: {
            ...orderHeader,
            items: {
              create: items
            }
          }
        });
      }
    }
    console.log(`Demo orders ready: ${demoOrders.length} orders across all fulfillment stages.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
