import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

/**
 * Categories for Jabour Phone Storefront & Testing
 * Each category includes an authentic Unsplash banner image, description, and sort order.
 */
export const CATEGORIES_SEED = [
  {
    name: "Smart Phones",
    slug: "smart-phones",
    description: "Flagship and everyday smartphones with official manufacturer warranty, verified battery health, and express delivery.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    sortOrder: 1,
    isActive: true
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "High-performance productivity tablets, iPads, and creative stylus displays for work, university, and creative projects.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Audio & Wearables",
    slug: "audio-wearables",
    description: "Active noise-canceling wireless earbuds, audiophile over-ear studio headphones, and next-gen fitness smartwatches.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    sortOrder: 3,
    isActive: true
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "High-speed GaN chargers, durable braided USB-C cables, MagSafe stands, military-grade cases, and 9H tempered glass.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    sortOrder: 4,
    isActive: true
  },
  {
    name: "Laptops & MacBooks",
    slug: "laptops-macbooks",
    description: "Ultra-portable ultrabooks, Apple Silicon MacBooks, and powerful creator workstations backed by full warranty.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    sortOrder: 5,
    isActive: true
  }
];

/**
 * Products Catalog for Jabour Phone Storefront & Testing
 * Each product has rich hardware specifications, realistic Moroccan Dirham prices,
 * multiple high-resolution photos, condition tags, stock counts, and finish options.
 */
export const PRODUCTS_SEED = [
  // ----------------------------------------------------
  // SMARTPHONES
  // ----------------------------------------------------
  {
    handle: "iphone-16-pro-max-256gb",
    title: "iPhone 16 Pro Max 256GB",
    categorySlug: "smart-phones",
    brand: "Apple",
    price: 14999.0,
    compare: 16499.0,
    costPrice: 13200.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-IPH16PM-256G",
    stock: 22,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "256GB",
    ram: "8GB",
    color: "Titanium Desert",
    spec: "6.9in Super Retina XDR OLED · A18 Pro · 256GB · 48MP Fusion Camera",
    screen: "6.9\" Super Retina XDR OLED, 120Hz ProMotion, Always-On, 2000 nits",
    battery: "4685 mAh, jusqu'à 33h de lecture vidéo, recharge rapide 25W MagSafe",
    camera: "48MP Fusion + 48MP Ultra Grand-Angle + 12MP Téléobjectif 5x",
    processor: "Apple A18 Pro (3nm), CPU 6 cœurs, GPU 6 cœurs, Neural Engine 16 cœurs",
    network: "5G Dual SIM (nano-SIM + eSIM), Wi-Fi 7, Bluetooth 5.3",
    warranty: "1 An Garantie Constructeur Apple + Jabour Care Express",
    description: `Le summum de l'ingénierie mobile Apple. L'iPhone 16 Pro Max combine un boîtier en titane de grade aérospatial ultra-léger avec le révolutionnaire écran Super Retina XDR de 6,9 pouces.
    
Propulsé par la puce Apple A18 Pro gravée en 3nm, il gère sans effort le montage vidéo 4K ProRes à 120 i/s et le gaming AAA. Le système de caméras professionnelles comprend un capteur Fusion 48MP nouvelle génération avec téléobjectif optique 5x.

Livré sous scellé d'origine avec câble USB-C tressé haute vitesse et garantie officielle 1 an.`,
    rating: 4.9,
    reviews: 48,
    finishes: ["Graphite", "Silver", "Midnight", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "samsung-galaxy-s24-ultra-512gb",
    title: "Samsung Galaxy S24 Ultra 512GB",
    categorySlug: "smart-phones",
    brand: "Samsung",
    price: 13499.0,
    compare: 14899.0,
    costPrice: 11800.0,
    supplier: "Samsung Electronics North Africa",
    sku: "JBF-S24U-512G",
    stock: 16,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "512GB",
    ram: "12GB",
    color: "Titanium Gray",
    spec: "6.8in Dynamic AMOLED 2X · Snapdragon 8 Gen 3 · 200MP Quad Cam · S-Pen",
    screen: "6.8\" Dynamic AMOLED 2X, 120Hz adaptatif, verre anti-reflet Gorilla Armor, 2600 nits",
    battery: "5000 mAh, charge ultra-rapide 45W, sans fil 15W, partage d'énergie sans fil",
    camera: "200MP Grand-Angle + 50MP Téléobjectif 5x + 10MP Téléobjectif 3x + 12MP Ultra Grand-Angle",
    processor: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm) Octa-Core",
    network: "5G Dual SIM + eSIM, Wi-Fi 7, Bluetooth 5.3, UWB",
    warranty: "1 An Garantie Officielle Samsung Maroc",
    description: `Libérez la puissance de Galaxy AI avec le Samsung Galaxy S24 Ultra. Doté d'un châssis en titane robuste et du verre Gorilla Armor éliminant jusqu'à 75% des reflets.
    
Grâce à son capteur principal de 200MP et son zoom optique IA jusqu'à 100x, capturez des détails spectaculaires même de nuit. Le stylet S-Pen intégré permet une prise de notes instantanée et la retouche photo assistée par intelligence artificielle.

Produit original certifié conforme pour les réseaux télécoms marocains.`,
    rating: 4.8,
    reviews: 36,
    finishes: ["Graphite", "Silver", "Midnight"],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "google-pixel-9-pro-256gb",
    title: "Google Pixel 9 Pro 256GB",
    categorySlug: "smart-phones",
    brand: "Google",
    price: 10999.0,
    compare: 11999.0,
    costPrice: 9500.0,
    supplier: "Google Hardware Distribution EU",
    sku: "JBF-PIX9P-256G",
    stock: 8,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "256GB",
    ram: "16GB",
    color: "Obsidian",
    spec: "6.3in Super Actua LTPO OLED 120Hz · Google Tensor G4 · Gemini Nano IA",
    screen: "6.3\" Super Actua LTPO OLED 1-120Hz, HDR10+, 3000 nits luminosité de pointe",
    battery: "4700 mAh, autonomie plus de 24h, charge rapide 27W filaire + 21W sans fil",
    camera: "50MP Grand-Angle Octa PD + 48MP Ultra Grand-Angle Macro + 48MP Téléobjectif 5x",
    processor: "Google Tensor G4 avec coprocesseur de sécurité Titan M2",
    network: "5G Sub-6/mmWave, Wi-Fi 7, Bluetooth 5.3, NFC",
    warranty: "1 An Garantie Jabour Phone Authentic",
    description: `Le meilleur de l'expérience Android pure propulsé par l'intelligence artificielle Gemini Nano. Le Pixel 9 Pro offre des performances photographiques incomparables avec la gomme magique avancée, le zoom haute résolution et la vidéo boost de nuit.
    
16 Go de RAM pour une fluidité sans faille et 7 ans de mises à jour de sécurité et du système d'exploitation garanties par Google.`,
    rating: 4.7,
    reviews: 19,
    finishes: ["Midnight", "White", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "xiaomi-14-ultra-512gb",
    title: "Xiaomi 14 Ultra 512GB (Optique Leica)",
    categorySlug: "smart-phones",
    brand: "Xiaomi",
    price: 11499.0,
    compare: 12999.0,
    costPrice: 10100.0,
    supplier: "Xiaomi Regional Distribution",
    sku: "JBF-XIA14U-512G",
    stock: 10,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "512GB",
    ram: "16GB",
    color: "Black Vegan Leather",
    spec: "6.73in WQHD+ AMOLED 120Hz · Capteur 1 pouce Leica · HyperCharge 90W",
    screen: "6.73\" AMOLED LTPO 120Hz WQHD+ (3200x1440), Dolby Vision, 3000 nits",
    battery: "5000 mAh, HyperCharge 90W filaire (100% en 33 min), 80W sans fil",
    camera: "Système Quadruple 50MP Leica avec ouverture variable continue f/1.63 - f/4.0",
    processor: "Snapdragon 8 Gen 3 (4nm) haute performance",
    network: "5G Dual SIM, Wi-Fi 7, Bluetooth 5.4, Infrarouge",
    warranty: "1 An Garantie Constructeur",
    description: `Un appareil photo de niveau professionnel intégré dans un smartphone d'exception. Conçu en partenariat étroit avec Leica, le Xiaomi 14 Ultra est équipé du prestigieux capteur Sony LYT-900 de 1 pouce et d'un diaphragme physique variable.
    
Finition luxueuse en cuir végan texturé nano-technologique résistant aux rayures et à l'usure quotidienne.`,
    rating: 4.6,
    reviews: 14,
    finishes: ["Midnight", "White"],
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },
  {
    handle: "iphone-15-128gb-certified-refurbished",
    title: "iPhone 15 128GB - Reconditionné Certifié Jabour",
    categorySlug: "smart-phones",
    brand: "Apple",
    price: 6999.0,
    compare: 8499.0,
    costPrice: 5800.0,
    supplier: "Jabour Phone Reconditionnement Certifié",
    sku: "JBF-IPH15-REF-128G",
    stock: 4,
    lowStockThreshold: 5,
    condition: "REFURBISHED",
    storage: "128GB",
    ram: "6GB",
    color: "Midnight Black",
    spec: "6.1in Super Retina XDR · Dynamic Island · USB-C · Batterie testée 100%",
    screen: "6.1\" Super Retina XDR OLED, Dynamic Island interactive, 2000 nits",
    battery: "Batterie testée certifiée santé 100%, port de charge USB-C standard",
    camera: "48MP Principal avec téléobjectif optique 2x + 12MP Ultra Grand-Angle",
    processor: "Apple A16 Bionic (4nm)",
    network: "5G, Wi-Fi 6, Bluetooth 5.3",
    warranty: "6 Mois Garantie Complète d'Échange Express",
    description: `Appareil reconditionné de Grade A+ comme neuf par l'atelier technique Jabour Phone. Chaque téléphone subit 45 points de contrôle rigoureux : écran d'origine sans aucune rayure, étanchéité vérifiée, batterie à 100% de sa capacité.
    
Bénéficiez des fonctionnalités avancées comme la Dynamic Island et le connecteur USB-C universel à un tarif très avantageux.`,
    rating: 4.8,
    reviews: 52,
    finishes: ["Midnight", "White", "Crimson"],
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },
  {
    handle: "samsung-galaxy-a55-5g-256gb",
    title: "Samsung Galaxy A55 5G 256GB",
    categorySlug: "smart-phones",
    brand: "Samsung",
    price: 3799.0,
    compare: 4299.0,
    costPrice: 3200.0,
    supplier: "Samsung Electronics Morocco",
    sku: "JBF-A55-256G",
    stock: 28,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "256GB",
    ram: "8GB",
    color: "Awesome Navy",
    spec: "6.6in Super AMOLED 120Hz · Exynos 1480 · 50MP OIS · IP67 Waterproof",
    screen: "6.6\" Super AMOLED FHD+ 120Hz, luminosité Vision Booster 1000 nits",
    battery: "5000 mAh longue autonomie (jusqu'à 2 jours), charge rapide 25W",
    camera: "50MP Grand-Angle avec stabilisation OIS + 12MP Ultra Grand-Angle + 5MP Macro",
    processor: "Samsung Exynos 1480 (4nm) avec processeur graphique AMD Xclipse 530",
    network: "5G Dual SIM, Wi-Fi 6, Bluetooth 5.3, certification étanche IP67",
    warranty: "1 An Garantie Constructeur Samsung Maroc",
    description: `Le champion du rapport qualité-prix de Samsung. Cadre métallique élégant, dos en verre résistant Gorilla Glass Victus+ et certification d'étanchéité à l'eau IP67.
    
Idéal pour le multitâche, les réseaux sociaux et la photographie quotidienne avec son capteur 50MP stabilisé.`,
    rating: 4.5,
    reviews: 28,
    finishes: ["Midnight", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },

  // ----------------------------------------------------
  // TABLETS
  // ----------------------------------------------------
  {
    handle: "ipad-pro-13-m4-256gb-wifi",
    title: "Apple iPad Pro 13\" M4 256GB Wi-Fi",
    categorySlug: "tablets",
    brand: "Apple",
    price: 13999.0,
    compare: 15200.0,
    costPrice: 12400.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-IPADP13-M4-256G",
    stock: 12,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "256GB",
    ram: "8GB",
    color: "Space Black",
    spec: "13in Ultra Retina XDR Tandem OLED · Puce M4 9-Core · 5.1mm Ultra-fin",
    screen: "13\" Ultra Retina XDR avec technologie Tandem OLED, ProMotion 120Hz, 1600 nits HDR",
    battery: "38.99 Wh, jusqu'à 10h d'autonomie en navigation, USB-C Thunderbolt 4",
    camera: "12MP Grand-Angle arrière avec scanner LiDAR, caméra paysage 12MP TrueDepth",
    processor: "Puce Apple M4 9 cœurs CPU, 10 cœurs GPU avec Ray Tracing à accélération matérielle",
    network: "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
    warranty: "1 An Garantie Constructeur Apple Officielle",
    description: `L'appareil le plus fin jamais créé par Apple avec seulement 5,1 mm d'épaisseur. Son écran révolutionnaire Tandem OLED combine deux dalles OLED pour atteindre une luminosité et un contraste absolus.
    
La puce M4 délivre une puissance de calcul phénoménale pour la modélisation 3D, le montage vidéo 8K et les flux de travail professionnels les plus exigeants. Compatible avec l'Apple Pencil Pro et le Magic Keyboard.`,
    rating: 4.9,
    reviews: 21,
    finishes: ["Graphite", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "ipad-air-11-m2-128gb-wifi",
    title: "Apple iPad Air 11\" M2 128GB Wi-Fi",
    categorySlug: "tablets",
    brand: "Apple",
    price: 7499.0,
    compare: 8299.0,
    costPrice: 6500.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-IPADAIR11-M2-128G",
    stock: 18,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "128GB",
    ram: "8GB",
    color: "Starlight",
    spec: "11in Liquid Retina Display · Puce M2 · Caméra avant paysage 12MP",
    screen: "11\" Liquid Retina IPS, affichage True Tone, large gamme de couleurs P3, 500 nits",
    battery: "28.93 Wh, jusqu'à 10h d'autonomie en Wi-Fi, port USB-C haute vitesse",
    camera: "12MP Grand-Angle arrière 4K, 12MP Ultra Grand-Angle avant paysage avec Cadre centré",
    processor: "Apple M2 8 cœurs CPU, 10 cœurs GPU, Neural Engine 16 cœurs",
    network: "Wi-Fi 6E, Bluetooth 5.3",
    warranty: "1 An Garantie Officielle Apple",
    description: `Polyvalent, puissant et léger. Le nouvel iPad Air 11 pouces intègre la puissante puce Apple M2 pour créer, apprendre, jouer et travailler sans compromis.
    
Prenez des notes précises avec l'Apple Pencil, connectez un clavier et profitez d'une journée entière d'autonomie.`,
    rating: 4.7,
    reviews: 33,
    finishes: ["Sand", "Silver", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },
  {
    handle: "samsung-galaxy-tab-s9-ultra-512gb",
    title: "Samsung Galaxy Tab S9 Ultra 512GB (S-Pen Inclus)",
    categorySlug: "tablets",
    brand: "Samsung",
    price: 12499.0,
    compare: 13800.0,
    costPrice: 10900.0,
    supplier: "Samsung Electronics North Africa",
    sku: "JBF-TABS9U-512G",
    stock: 3,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "512GB",
    ram: "12GB",
    color: "Graphite",
    spec: "14.6in Dynamic AMOLED 2X 120Hz · Snapdragon 8 Gen 2 · IP68 Étanchéité",
    screen: "14.6\" Dynamic AMOLED 2X 120Hz HDR10+ (2960x1848), ratio immersif 16:10",
    battery: "11200 mAh monumentale, charge rapide 45W",
    camera: "Double caméra arrière 13MP + 8MP ultra grand-angle, double caméra avant 12MP",
    processor: "Qualcomm Snapdragon 8 Gen 2 for Galaxy (4nm)",
    network: "Wi-Fi 6E, Bluetooth 5.3, certification IP68 étanche eau et poussière",
    warranty: "1 An Garantie Samsung Officielle",
    description: `Une surface de travail géante de 14,6 pouces dans un châssis en Armor Aluminum ultra-résistant. La première tablette grand public certifiée IP68 résistant à l'eau et aux éclaboussures.
    
Le stylet S-Pen étanche à latence ultra-faible est inclus dans la boîte pour transformer votre tablette en véritable planche à dessin numérique et bureau mobile avec le mode Samsung DeX.`,
    rating: 4.8,
    reviews: 17,
    finishes: ["Graphite", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },

  // ----------------------------------------------------
  // AUDIO & WEARABLES
  // ----------------------------------------------------
  {
    handle: "apple-airpods-pro-2-usb-c",
    title: "Apple AirPods Pro 2 (USB-C & Boîtier MagSafe)",
    categorySlug: "audio-wearables",
    brand: "Apple",
    price: 2699.0,
    compare: 3199.0,
    costPrice: 2200.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-APP2-USBC",
    stock: 35,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: null,
    ram: null,
    color: "White Glossy",
    spec: "Réduction Active du Bruit 2x · Audio Spatial Personnalisé · Boîtier MagSafe USB-C",
    screen: "Commandes tactiles par glissement de volume et capteurs de pression",
    battery: "Jusqu'à 6h d'écoute par charge (30h au total avec le boîtier MagSafe)",
    camera: "N/A - Transducteur Apple exclusif à haute excursion et amplificateur personnalisé",
    processor: "Puce d'écoute Apple H2 + Puce U1 Localiser dans le boîtier",
    network: "Bluetooth 5.3, résistance à la poussière, transpiration et eau IP54",
    warranty: "1 An Garantie Officielle Apple Constructeur",
    description: `La référence absolue des écouteurs sans fil intra-auriculaires. La puce H2 conçue par Apple assure une réduction active du bruit jusqu'à deux fois plus efficace que la génération précédente.
    
Profitez du mode Transparence adaptative, de l'Audio Spatial personnalisé avec suivi dynamique des mouvements de la tête et d'un nouveau boîtier de charge MagSafe rechargeable en USB-C doté d'un haut-parleur pour la localisation Localiser.`,
    rating: 4.9,
    reviews: 84,
    finishes: ["White"],
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "sony-wh-1000xm5-wireless-anc",
    title: "Sony WH-1000XM5 Casque Sans Fil ANC",
    categorySlug: "audio-wearables",
    brand: "Sony",
    price: 3599.0,
    compare: 4199.0,
    costPrice: 2950.0,
    supplier: "Sony Consumer Electronics MENA",
    sku: "JBF-SONY-XM5",
    stock: 14,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: null,
    ram: null,
    color: "Midnight Black",
    spec: "30h Batterie · Réduction de bruit Pro 8 micros · Audio Hi-Res LDAC",
    screen: "Commandes gestuelles tactiles capacitives sur l'oreillette droite",
    battery: "Jusqu'à 30h avec réduction active du bruit (40h sans ANC), charge rapide 3 min = 3h",
    camera: "8 microphones dédiés à l'atténuation sonore et 4 microphones de voix IA",
    processor: "Double processeur : Processeur V1 + Processeur HD QN1 exclusif Sony",
    network: "Bluetooth 5.2 multipoint (connexion à 2 appareils simultanés), NFC, Jack 3.5mm",
    warranty: "1 An Garantie Constructeur Sony Maroc",
    description: `Le casque supra-auriculaire le plus primé au monde pour son isolation acoustique d'exception. Deux processeurs et huit microphones contrôlent en temps réel l'annulation du bruit environnant.
    
Confort exceptionnel grâce aux coussinets en cuir souple ultra-doux qui épousent parfaitement la forme du crâne sans pression excessive. Compatible avec les fichiers audio haute résolution sans fil via le codec LDAC.`,
    rating: 4.8,
    reviews: 42,
    finishes: ["Midnight", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "apple-watch-ultra-2-gps-cellular",
    title: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
    categorySlug: "audio-wearables",
    brand: "Apple",
    price: 8999.0,
    compare: 9999.0,
    costPrice: 7900.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-AWU2-49MM",
    stock: 9,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "64GB",
    ram: null,
    color: "Titanium Natural",
    spec: "Boîtier Titane 49mm · Écran 3000 nits · Autonomie jusqu'à 72h · GPS bi-fréquence",
    screen: "49mm écran Retina OLED toujours actif, verre saphir plat anti-rayures, 3000 nits",
    battery: "Jusqu'à 36h en usage normal (72h en mode économie d'énergie), recharge rapide",
    camera: "Capteurs de santé avancés : ECG, SpO2, profondimètre certifié EN13319 40m",
    processor: "Puce Apple S9 SiP avec geste révolutionnaire Double Tap",
    network: "4G LTE & UMTS autonome, GPS double fréquence haute précision L1 et L5",
    warranty: "1 An Garantie Officielle Apple",
    description: `Conçue pour repousser les limites de l'aventure, de l'endurance et des sports aquatiques extrêmes. Le boîtier en titane de 49 mm protège l'écran plat en cristal de saphir avec des bords surélevés.
    
Bouton Action personnalisable, sirène de détresse de 86 décibels audible jusqu'à 180 mètres et autonomie record pour les ultra-marathons et expéditions prolongées.`,
    rating: 4.9,
    reviews: 15,
    finishes: ["Sand", "Midnight", "Steel"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },

  // ----------------------------------------------------
  // ACCESSORIES
  // ----------------------------------------------------
  {
    handle: "anker-prime-65w-gan-fast-charger",
    title: "Anker Prime 65W GaN Chargeur Rapide USB-C (3 Ports)",
    categorySlug: "accessories",
    brand: "Anker",
    price: 499.0,
    compare: 599.0,
    costPrice: 340.0,
    supplier: "Anker Innovations Regional Distribution",
    sku: "JBF-ANK-65WGAN",
    stock: 45,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: null,
    ram: null,
    color: "Black & Silver",
    spec: "Technologie GaNPrime™ · 2x USB-C (65W) + 1x USB-A · Format Ultra-Compact",
    screen: null,
    battery: "Régulation thermique continue ActiveShield™ 2.0 (surveille la température 3M fois/jour)",
    camera: null,
    processor: "Contrôleur intelligent de puissance PowerIQ 4.0 avec répartition dynamique",
    network: "Charge simultanée pour 3 appareils : iPhone, MacBook et écouteurs",
    warranty: "2 Ans Garantie d'Échange Neuf Anker",
    description: `Rechargez tous vos appareils mobiles et votre ordinateur portable avec un seul chargeur compact 53% plus petit qu'un adaptateur MacBook original de 67W.
    
Grâce à la technologie GaNPrime de pointe, ce chargeur délivre jusqu'à 65W de puissance stable sans surchauffe. Fiche européenne standard compatible avec toutes les prises murales du Maroc.`,
    rating: 4.8,
    reviews: 67,
    finishes: ["Midnight", "Graphite"],
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609592424300-332e1858a8a7?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },
  {
    handle: "spigen-ultra-hybrid-magsafe-case",
    title: "Coque Spigen Ultra Hybrid MagSafe Antichoc",
    categorySlug: "accessories",
    brand: "Spigen",
    price: 249.0,
    compare: 320.0,
    costPrice: 140.0,
    supplier: "Spigen Korea Distribution",
    sku: "JBF-SPG-MAGCASE",
    stock: 60,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: null,
    ram: null,
    color: "Clear White",
    spec: "Protection Militaire Air Cushion · Anneau MagSafe Intégré · Formule Anti-Jaunissement",
    screen: "Bordures surélevées protégeant la dalle tactile et le bloc optique",
    battery: null,
    camera: "Cadre protecteur surélevé en polyuréthane thermoplastique (TPU)",
    processor: null,
    network: "Aimants N52 néodyme puissants pour accessoires et supports voiture MagSafe",
    warranty: "Garantie Anti-Jaunissement et défaut de fabrication Spigen",
    description: `La coque de protection la plus populaire au monde. Laissez transparaître la couleur originale de votre téléphone tout en lui offrant une protection antichoc certifiée de niveau militaire.
    
Le dos rigide en polycarbonate résiste aux micro-rayures tandis que les coins intègrent la technologie Air Cushion pour dissiper l'énergie cinétique en cas de chute accidentelle.`,
    rating: 4.7,
    reviews: 58,
    finishes: ["Graphite", "White"],
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },
  {
    handle: "belkin-boostcharge-pro-3in1-magsafe",
    title: "Belkin BoostCharge Pro Station 3-en-1 MagSafe 15W",
    categorySlug: "accessories",
    brand: "Belkin",
    price: 1199.0,
    compare: 1399.0,
    costPrice: 890.0,
    supplier: "Belkin International MENA",
    sku: "JBF-BLK-3IN1",
    stock: 0, // OUT OF STOCK TEST
    lowStockThreshold: 5,
    condition: "NEW",
    storage: null,
    ram: null,
    color: "White & Chrome",
    spec: "Charge Rapide Officielle MagSafe 15W · iPhone + Apple Watch + AirPods · Finition Premium",
    screen: null,
    battery: "Charge rapide sans fil 15W certifiée Apple Made for MagSafe (MFM)",
    camera: null,
    processor: "Gestionnaire d'alimentation intelligent certifié Qi2 et MFM",
    network: "Adaptateur secteur mural 40W officiel Belkin inclus dans le packaging",
    warranty: "2 Ans Garantie Belkin + Assurance matériel connecté jusqu'à 25,000 DH",
    description: `La station de chevet et de bureau ultime pour les utilisateurs de l'écosystème Apple. Fabriquée avec des bras architecturaux en acier inoxydable chromé poli et une base en silicone douce.
    
Recharge sans fil rapide officielle 15W pour iPhone en mode portrait ou paysage (parfait pour le mode En veille d'iOS 17/18), charge rapide pour Apple Watch et socle dédié pour AirPods.`,
    rating: 4.9,
    reviews: 29,
    finishes: ["White", "Midnight"],
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  },

  // ----------------------------------------------------
  // LAPTOPS & COMPUTERS
  // ----------------------------------------------------
  {
    handle: "macbook-air-13-m3-16gb-512gb",
    title: "Apple MacBook Air 13\" M3 (16GB · 512GB SSD)",
    categorySlug: "laptops-macbooks",
    brand: "Apple",
    price: 13499.0,
    compare: 14999.0,
    costPrice: 11900.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-MBA13-M3-16-512",
    stock: 15,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "512GB SSD",
    ram: "16GB",
    color: "Midnight Blue",
    spec: "13.6in Liquid Retina · Puce M3 · 16GB RAM · 512GB SSD · 18h Autonomie",
    screen: "13.6\" Liquid Retina LED IPS (2560x1664), 500 nits, True Tone, 1 milliard de couleurs",
    battery: "Batterie lithium-polymère 52.6 Wh, jusqu'à 18h d'autonomie, recharge MagSafe 3",
    camera: "Caméra FaceTime HD 1080p avec processeur de signal d'image avancé",
    processor: "Apple M3 8 cœurs CPU (4 performance + 4 efficience), 10 cœurs GPU avec Mesh Shading",
    network: "Wi-Fi 6E (802.11ax), Bluetooth 5.3, 2x ports Thunderbolt / USB 4, prise casque 3.5mm",
    warranty: "1 An Garantie Constructeur Apple Officielle",
    description: `L'ordinateur portable ultra-fin le plus plébiscité au monde devient encore plus puissant avec la puce Apple M3. D'une finesse remarquable de 11,3 mm, son boîtier 100% aluminium intègre une finition anodisée spéciale anti-traces de doigts.
    
Grâce à ses 16 Go de mémoire unifiée et ses 512 Go de stockage NVMe, gérez les projets de code, la retouche photo et le multitâche intensif dans un silence absolu grâce à sa conception sans ventilateur.`,
    rating: 4.9,
    reviews: 31,
    finishes: ["Midnight", "Silver", "Sand"],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: true,
    isFeatured: true
  },
  {
    handle: "macbook-pro-14-m3-pro-18gb-512gb",
    title: "Apple MacBook Pro 14\" M3 Pro (18GB · 512GB Space Black)",
    categorySlug: "laptops-macbooks",
    brand: "Apple",
    price: 21999.0,
    compare: 23500.0,
    costPrice: 19500.0,
    supplier: "Apple Authorized Distribution MENA",
    sku: "JBF-MBP14-M3P-18-512",
    stock: 7,
    lowStockThreshold: 5,
    condition: "NEW",
    storage: "512GB SSD",
    ram: "18GB",
    color: "Space Black",
    spec: "14.2in Liquid Retina XDR 120Hz · Puce M3 Pro · 18GB RAM · 512GB SSD",
    screen: "14.2\" Liquid Retina XDR Mini-LED, 120Hz ProMotion, 1000 nits constant (1600 nits HDR)",
    battery: "Batterie 70 Wh, jusqu'à 18h d'autonomie, recharge rapide 96W USB-C MagSafe 3",
    camera: "Caméra FaceTime HD 1080p, ensemble de 3 micros de qualité studio avec formation de faisceaux",
    processor: "Apple M3 Pro 11 cœurs CPU, 14 cœurs GPU, bande passante mémoire 150 Go/s",
    network: "Wi-Fi 6E, Bluetooth 5.3, port HDMI 8K, lecteur de carte SDXC, 3x Thunderbolt 4",
    warranty: "1 An Garantie Constructeur Apple + Jabour VIP Support",
    description: `Une bête de course absolue pour les ingénieurs logiciels, créateurs de contenu et professionnels de la vidéo. L'écran Liquid Retina XDR offre la meilleure plage dynamique de l'industrie avec un contraste infini de 1 000 000:1.
    
Finition Noir Sidéral captivante avec un procédé de scellement chimique inédit contre les empreintes de doigts.`,
    rating: 5.0,
    reviews: 12,
    finishes: ["Midnight", "Silver"],
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
    ],
    featured: false,
    isFeatured: false
  }
];

/**
 * Sample Verified Reviews for Product Detail Testing
 */
export const REVIEWS_SEED = [
  {
    productHandle: "iphone-16-pro-max-256gb",
    authorName: "Karim Benjelloun",
    rating: 5,
    comment: "Service impeccable chez Jabour Phone ! Téléphone reçu scellé le lendemain de la commande à Casablanca. La caméra et l'autonomie sont tout simplement spectaculaires.",
    isApproved: true
  },
  {
    productHandle: "iphone-16-pro-max-256gb",
    authorName: "Sofia El Amrani",
    rating: 5,
    comment: "100% authentique avec vérification du numéro de série sur le site d'Apple. Emballage très soigné et paiement à la livraison sans stress.",
    isApproved: true
  },
  {
    productHandle: "samsung-galaxy-s24-ultra-512gb",
    authorName: "Mehdi Tazi",
    rating: 5,
    comment: "Le meilleur smartphone Android du marché. Le verre Gorilla Armor fait une différence énorme en plein soleil à Marrakech. Recommandé à 100%.",
    isApproved: true
  },
  {
    productHandle: "apple-airpods-pro-2-usb-c",
    authorName: "Youssef Chraibi",
    rating: 5,
    comment: "La réduction de bruit dans les transports ou en avion est bluffante. Le port USB-C est enfin là, plus besoin de câble Lightning !",
    isApproved: true
  },
  {
    productHandle: "sony-wh-1000xm5-wireless-anc",
    authorName: "Amine Alami",
    rating: 5,
    comment: "Qualité de son studio incomparable. Je l'utilise 8 heures par jour pour le télétravail, aucun mal de tête et les micros coupent tous les bruits de fond.",
    isApproved: true
  },
  {
    productHandle: "macbook-air-13-m3-16gb-512gb",
    authorName: "Leila Berrada",
    rating: 5,
    comment: "Machine ultra rapide, batterie qui tient 2 jours entiers de bureautique et cours sans charger. Jabour Phone a livré en express à Rabat.",
    isApproved: true
  }
];

/**
 * Test Discount Coupons for Cart & Checkout Testing
 */
export const COUPONS_SEED = [
  {
    code: "WELCOME10",
    discountType: "PERCENTAGE",
    discountValue: new Prisma.Decimal("10.00"),
    minOrderAmount: new Prisma.Decimal("200.00"),
    maxDiscount: new Prisma.Decimal("300.00"),
    usageLimit: 500,
    isActive: true
  },
  {
    code: "JABOUR50",
    discountType: "FIXED",
    discountValue: new Prisma.Decimal("50.00"),
    minOrderAmount: new Prisma.Decimal("400.00"),
    maxDiscount: null,
    usageLimit: 200,
    isActive: true
  },
  {
    code: "VIPTECH",
    discountType: "PERCENTAGE",
    discountValue: new Prisma.Decimal("15.00"),
    minOrderAmount: new Prisma.Decimal("1000.00"),
    maxDiscount: new Prisma.Decimal("600.00"),
    usageLimit: 100,
    isActive: true
  }
];

/**
 * Main Safe Seed Execution Function
 */
async function main() {
  console.log("==================================================");
  console.log("🌱 Running Jabour Phone Full Test Catalog Seed");
  console.log("==================================================");

  // 1. Initialize StoreSettings singleton
  console.log("1. Setting up StoreSettings...");
  const existingSettings = await prisma.storeSettings.findFirst();
  if (!existingSettings) {
    await prisma.storeSettings.create({
      data: {
        storeName: "Jabour Phone",
        phone: "+212 5 22 12 34 56",
        whatsapp: "+212 6 61 12 34 56",
        email: "contact@jabourphone.ma",
        address: "Boulevard Al Massira Al Khadra, Maarif",
        city: "Casablanca",
        country: "Morocco",
        currency: "MAD",
        currencySymbol: "DH",
        shippingFee: new Prisma.Decimal("35.00"),
        freeShippingThreshold: new Prisma.Decimal("300.00"),
        workingHours: "Lun - Sam: 09:00 - 20:00",
        announcement: "🚚 Livraison Express Gratuite Partout au Maroc dès 300 DH | 100% Authentique & Garanti",
        aboutText:
          "Jabour Phone est votre référence premium au Maroc pour les smartphones récents, tablettes, audio et accessoires officiels avec garantie constructeur et paiement à la livraison.",
        facebook: "https://facebook.com/jabourphone",
        instagram: "https://instagram.com/jabourphone",
        tiktok: "https://tiktok.com/@jabourphone"
      }
    });
    console.log("   ✓ Default StoreSettings created.");
  } else {
    console.log("   ✓ StoreSettings already present.");
  }

  // 2. Initialize Categories with Images & Rich Information
  console.log("2. Initializing categories with images...");
  const categoryMap = new Map<string, number>();

  for (const cat of CATEGORIES_SEED) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive
      },
      create: cat
    });
    categoryMap.set(upserted.slug, upserted.id);
    categoryMap.set(upserted.name, upserted.id);
    console.log(`   ✓ Category: ${upserted.name} (ID: ${upserted.id}, Slug: ${upserted.slug})`);
  }

  // 3. Initialize Products with Complete Hardware Information & Multiple Pictures
  console.log("3. Initializing products catalog with full pictures and specs...");
  const productMap = new Map<string, number>();

  for (const prod of PRODUCTS_SEED) {
    const { categorySlug, ...rest } = prod;
    const categoryId = categoryMap.get(categorySlug);
    if (!categoryId) {
      throw new Error(`Category "${categorySlug}" not found in database for product "${prod.title}"`);
    }

    const upserted = await prisma.product.upsert({
      where: { handle: prod.handle },
      update: {
        ...rest,
        categoryId,
        price: new Prisma.Decimal(rest.price.toFixed(2)),
        compare: rest.compare ? new Prisma.Decimal(rest.compare.toFixed(2)) : null,
        costPrice: rest.costPrice ? new Prisma.Decimal(rest.costPrice.toFixed(2)) : null,
        isActive: true,
        isArchived: false
      },
      create: {
        ...rest,
        categoryId,
        price: new Prisma.Decimal(rest.price.toFixed(2)),
        compare: rest.compare ? new Prisma.Decimal(rest.compare.toFixed(2)) : null,
        costPrice: rest.costPrice ? new Prisma.Decimal(rest.costPrice.toFixed(2)) : null,
        isActive: true,
        isArchived: false
      }
    });
    productMap.set(upserted.handle, upserted.id);
    console.log(`   ✓ Product: ${upserted.title} [${upserted.brand}] - ${upserted.price} DH (Stock: ${upserted.stock})`);
  }

  // 4. Initialize Verified Customer Reviews
  console.log("4. Initializing product reviews...");
  for (const rev of REVIEWS_SEED) {
    const productId = productMap.get(rev.productHandle);
    if (!productId) continue;

    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        authorName: rev.authorName
      }
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          productId,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          isApproved: rev.isApproved
        }
      });
      console.log(`   ✓ Review by ${rev.authorName} on product ${rev.productHandle}`);
    }
  }

  // 5. Initialize Discount Coupons
  console.log("5. Initializing promotional coupons...");
  for (const coup of COUPONS_SEED) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: {
        discountType: coup.discountType,
        discountValue: coup.discountValue,
        minOrderAmount: coup.minOrderAmount,
        maxDiscount: coup.maxDiscount,
        usageLimit: coup.usageLimit,
        isActive: coup.isActive
      },
      create: coup
    });
    console.log(`   ✓ Coupon code: ${coup.code} (${coup.discountValue} ${coup.discountType === "PERCENTAGE" ? "%" : "DH"})`);
  }

  // 6. Initialize Super Admin Account (if none exists)
  console.log("6. Checking administrator accounts...");
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    const adminEmail = (process.env.ADMIN_EMAIL || "jabour@jabourphone.com").toLowerCase().trim();
    const adminName = process.env.ADMIN_NAME || "Jabour";
    const rawPassword = process.env.ADMIN_PASSWORD || "JabourPhone2026!Secure";
    const passwordHash = await hashPassword(rawPassword);

    await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN"
      }
    });

    console.log(`   ✓ Created initial Super Admin: ${adminEmail}`);
    console.log(`   🔑 Default password: "${rawPassword}"`);
  } else {
    console.log(`   ✓ Found ${adminCount} existing admin account(s). Skipped admin creation.`);
  }

  // 7. Initialize Sample Demo Customer Orders (for admin dashboard testing)
  console.log("7. Initializing sample customer orders...");
  const sampleProduct1 = await prisma.product.findFirst({
    where: { handle: "iphone-16-pro-max-256gb" }
  });
  const sampleProduct2 = await prisma.product.findFirst({
    where: { handle: "apple-airpods-pro-2-usb-c" }
  });
  const sampleProduct3 = await prisma.product.findFirst({
    where: { handle: "anker-prime-65w-gan-fast-charger" }
  });

  if (sampleProduct1 && sampleProduct2) {
    const demoOrders = [
      {
        orderNumber: "JP-2611-7001",
        customerName: "Mohamed El Fassi",
        customerEmail: "mohamed.elfassi@example.com",
        customerPhone: "+212 6 61 22 33 44",
        customerAddress: "Résidence Les Iris, Rue Abou Bakr Esseddik, Maarif",
        city: "Casablanca",
        notes: "Merci de m'appeler 15 minutes avant la livraison.",
        paymentMethod: "COD",
        subtotal: sampleProduct1.price,
        shippingFee: new Prisma.Decimal("0.00"),
        tax: new Prisma.Decimal("0.00"),
        totalAmount: sampleProduct1.price,
        status: "PENDING" as const,
        items: [
          {
            productId: sampleProduct1.id,
            productTitle: sampleProduct1.title,
            selectedFinish: "Graphite",
            quantity: 1,
            price: sampleProduct1.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-7002",
        customerName: "Imane Kadiri",
        customerEmail: "imane.kadiri@example.com",
        customerPhone: "+212 6 62 88 99 00",
        customerAddress: "Avenue Annakhil, Hay Riad, Villa 12",
        city: "Rabat",
        notes: "Livraison le matin si possible.",
        paymentMethod: "COD",
        subtotal: sampleProduct2.price,
        shippingFee: new Prisma.Decimal("0.00"),
        tax: new Prisma.Decimal("0.00"),
        totalAmount: sampleProduct2.price,
        status: "CONFIRMED" as const,
        items: [
          {
            productId: sampleProduct2.id,
            productTitle: sampleProduct2.title,
            selectedFinish: "White",
            quantity: 1,
            price: sampleProduct2.price
          }
        ]
      },
      {
        orderNumber: "JP-2611-7003",
        customerName: "Othmane Bennani",
        customerEmail: "othmane.bennani@example.com",
        customerPhone: "+212 6 63 44 55 66",
        customerAddress: "Boulevard Mohamed VI, Guéliz",
        city: "Marrakech",
        notes: "Laisser chez le concierge de l'immeuble.",
        paymentMethod: "COD",
        subtotal: sampleProduct3 ? sampleProduct3.price : new Prisma.Decimal("499.00"),
        shippingFee: new Prisma.Decimal("0.00"),
        tax: new Prisma.Decimal("0.00"),
        totalAmount: sampleProduct3 ? sampleProduct3.price : new Prisma.Decimal("499.00"),
        status: "DELIVERED" as const,
        items: [
          {
            productId: sampleProduct3?.id || sampleProduct2.id,
            productTitle: sampleProduct3?.title || sampleProduct2.title,
            selectedFinish: "Midnight",
            quantity: 1,
            price: sampleProduct3 ? sampleProduct3.price : new Prisma.Decimal("499.00")
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
        console.log(`   ✓ Order: ${orderHeader.orderNumber} (${orderHeader.status}) for ${orderHeader.customerName}`);
      }
    }
  }

  console.log("==================================================");
  console.log(`✅ Seed successfully completed!`);
  console.log(`   • ${CATEGORIES_SEED.length} Categories with high-res photos and descriptions`);
  console.log(`   • ${PRODUCTS_SEED.length} Products with complete hardware specs and images`);
  console.log(`   • ${REVIEWS_SEED.length} Verified customer reviews`);
  console.log(`   • ${COUPONS_SEED.length} Active promotional coupons`);
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
