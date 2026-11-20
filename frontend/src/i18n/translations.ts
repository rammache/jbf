export type SupportedLanguage = "fr" | "ar";

export interface Translations {
  nav: {
    home: string;
    shop: string;
    track: string;
    contact: string;
    about: string;
    faq: string;
    shipping: string;
    returns: string;
    privacy: string;
    terms: string;
    admin: string;
    login: string;
  };
  header: {
    searchPlaceholder: string;
    searchEsc: string;
    noResults: string;
    cartTitle: string;
  };
  common: {
    free: string;
    loading: string;
    save: string;
    dirham: string;
    allCategories: string;
    currencySymbol: string;
  };
  announcements: {
    freeShipping: string;
    genuine: string;
    whatsapp: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaShop: string;
    ctaPromo: string;
  };
  features: {
    shippingTitle: string;
    shippingDesc: string;
    warrantyTitle: string;
    warrantyDesc: string;
    paymentTitle: string;
    paymentDesc: string;
    genuineTitle: string;
    genuineDesc: string;
  };
  shop: {
    title: string;
    subtitle: string;
    filters: string;
    categories: string;
    brands: string;
    priceRange: string;
    clearFilters: string;
    sortBy: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    inStock: string;
    outOfStock: string;
    lowStock: string;
    sale: string;
    newBadge: string;
    addToCart: string;
    viewDetails: string;
  };
  product: {
    specifications: string;
    description: string;
    reviews: string;
    condition: string;
    storage: string;
    ram: string;
    color: string;
    screen: string;
    battery: string;
    camera: string;
    processor: string;
    network: string;
    warranty: string;
    quantity: string;
    orderOnWhatsapp: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyDesc: string;
    startShopping: string;
    subtotal: string;
    discount: string;
    shipping: string;
    total: string;
    couponCode: string;
    apply: string;
    checkout: string;
    freeShippingProgress: string;
    freeShippingBadge: string;
  };
  checkout: {
    title: string;
    contactInfo: string;
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    notes: string;
    paymentMethod: string;
    codTitle: string;
    codDesc: string;
    confirmOrder: string;
    orderSuccess: string;
    orderPlacedDesc: string;
    whatsappConfirm: string;
  };
  tracking: {
    title: string;
    subtitle: string;
    orderNumber: string;
    contact: string;
    searchBtn: string;
    status: string;
    statusPending: string;
    statusConfirmed: string;
    statusProcessing: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
    statusReturned: string;
  };
  footer: {
    aboutStore: string;
    quickLinks: string;
    customerService: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    subscribe: string;
    copyright: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  fr: {
    nav: {
      home: "Accueil",
      shop: "Boutique",
      track: "Suivi de commande",
      contact: "Contact",
      about: "À Propos",
      faq: "FAQ",
      shipping: "Livraison",
      returns: "Retours & Garantie",
      privacy: "Confidentialité",
      terms: "Conditions Générales",
      admin: "Administration",
      login: "Connexion"
    },
    header: {
      searchPlaceholder: "Rechercher un smartphone, accessoire, marque...",
      searchEsc: "Échap pour fermer",
      noResults: "Aucun résultat trouvé",
      cartTitle: "Mon Panier"
    },
    common: {
      free: "GRATUIT",
      loading: "Chargement...",
      save: "Économisez",
      dirham: "DH",
      allCategories: "Toutes les catégories",
      currencySymbol: "DH"
    },
    announcements: {
      freeShipping: "Livraison express gratuite partout au Maroc dès 300 DH",
      genuine: "Smartphones 100% authentiques avec garantie officielle Jabour Phone",
      whatsapp: "Besoin d'aide ? Contactez notre support WhatsApp au"
    },
    hero: {
      badge: "Nouveautés & Offres Exclusives",
      title: "Smartphones & Accessoires au Maroc",
      subtitle:
        "Découvrez notre sélection de smartphones certifiés, accessoires haut de gamme et produits technologiques au meilleur prix avec livraison express.",
      ctaShop: "Explorer le catalogue",
      ctaPromo: "Offres du moment"
    },
    features: {
      shippingTitle: "Livraison Rapide",
      shippingDesc: "Partout au Maroc en 24h à 48h",
      warrantyTitle: "Garantie Officielle",
      warrantyDesc: "Garantie constructeur et SAV dédié",
      paymentTitle: "Paiement à la Livraison",
      paymentDesc: "Payez en espèces à la réception de votre colis",
      genuineTitle: "100% Authentique",
      genuineDesc: "Appareils certifiés neufs et reconditionnés"
    },
    shop: {
      title: "Notre Catalogue",
      subtitle: "Parcourez notre gamme complète de smartphones, tablettes et accessoires certifiés.",
      filters: "Filtres",
      categories: "Catégories",
      brands: "Marques",
      priceRange: "Fourchette de prix",
      clearFilters: "Réinitialiser",
      sortBy: "Trier par",
      sortFeatured: "Sélectionnés en vedette",
      sortPriceAsc: "Prix : croissant",
      sortPriceDesc: "Prix : décroissant",
      sortRating: "Meilleures notes",
      inStock: "En stock",
      outOfStock: "Rupture de stock",
      lowStock: "Stock limité",
      sale: "Promo",
      newBadge: "Nouveau",
      addToCart: "Ajouter au panier",
      viewDetails: "Voir fiche"
    },
    product: {
      specifications: "Fiche technique",
      description: "Description du produit",
      reviews: "Avis vérifiés",
      condition: "État",
      storage: "Capacité",
      ram: "Mémoire RAM",
      color: "Couleur",
      screen: "Écran",
      battery: "Batterie",
      camera: "Appareil photo",
      processor: "Processeur",
      network: "Réseau",
      warranty: "Garantie",
      quantity: "Quantité",
      orderOnWhatsapp: "Commander directement via WhatsApp"
    },
    cart: {
      title: "Votre Panier",
      empty: "Votre panier est vide",
      emptyDesc: "Découvrez notre catalogue et ajoutez vos produits favoris !",
      startShopping: "Découvrir la boutique",
      subtotal: "Sous-total",
      discount: "Remise",
      shipping: "Frais de livraison",
      total: "Total à payer",
      couponCode: "Code promo",
      apply: "Appliquer",
      checkout: "Passer la commande",
      freeShippingProgress: "Ajoutez {amount} supplémentaires pour obtenir la",
      freeShippingBadge: "Livraison Gratuite !"
    },
    checkout: {
      title: "Finaliser votre commande",
      contactInfo: "Vos Coordonnées de Livraison",
      fullName: "Nom et prénom",
      phone: "Numéro de téléphone portable (Maroc)",
      email: "Adresse e-mail (optionnelle)",
      city: "Ville de destination",
      address: "Adresse complète de livraison",
      notes: "Instructions ou repères pour le livreur",
      paymentMethod: "Mode de règlement",
      codTitle: "Paiement à la livraison (Cash on Delivery)",
      codDesc: "Vous ne payez qu'après réception et vérification physique de votre colis.",
      confirmOrder: "Confirmer ma commande",
      orderSuccess: "Merci pour votre commande !",
      orderPlacedDesc:
        "Votre commande #{orderNumber} a été enregistrée avec succès. Notre service de livraison vous contactera avant le passage du coursier.",
      whatsappConfirm: "Accélérer la confirmation sur WhatsApp"
    },
    tracking: {
      title: "Suivre votre commande",
      subtitle: "Suivez l'acheminement de votre colis en temps réel avec votre numéro de commande.",
      orderNumber: "Numéro de commande (ex: JP-2611-1234)",
      contact: "Téléphone ou e-mail associé",
      searchBtn: "Rechercher la commande",
      status: "Statut actuel",
      statusPending: "En attente de confirmation",
      statusConfirmed: "Commande confirmée",
      statusProcessing: "En cours de préparation",
      statusShipped: "En cours de livraison",
      statusDelivered: "Colis livré",
      statusCancelled: "Commande annulée",
      statusReturned: "Colis retourné"
    },
    footer: {
      aboutStore:
        "Jabour Phone est votre boutique spécialisée au Maroc pour les smartphones authentiques, tablettes et accessoires d'origine avec garantie.",
      quickLinks: "Accès Rapide",
      customerService: "Service Client",
      newsletterTitle: "Restez Connecté",
      newsletterDesc: "Inscrivez-vous pour recevoir nos offres promotionnelles et nouveaux arrivages.",
      newsletterPlaceholder: "Votre adresse e-mail...",
      subscribe: "S'inscrire",
      copyright: "Tous droits réservés. Spécialiste smartphone au Maroc."
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      shop: "المتجر",
      track: "تتبع طلبي",
      contact: "اتصل بنا",
      about: "من نحن",
      faq: "الأسئلة الشائعة",
      shipping: "الشحن والتوصيل",
      returns: "الضمان والإرجاع",
      privacy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      admin: "لوحة الإدارة",
      login: "تسجيل الدخول"
    },
    header: {
      searchPlaceholder: "ابحث عن هاتف ذكي، إكسسوار، ماركة...",
      searchEsc: "اضغط Esc للإغلاق",
      noResults: "لم يتم العثور على نتائج",
      cartTitle: "سلة التسوق"
    },
    common: {
      free: "مجاناً",
      loading: "جاري التحميل...",
      save: "وفّر",
      dirham: "د.م.",
      allCategories: "جميع الفئات",
      currencySymbol: "د.م."
    },
    announcements: {
      freeShipping: "🚚 توصيل سريع ومجاني في جميع أنحاء المغرب للطلبات ابتداءً من 300 د.م.",
      genuine: "هواتف ذكية أصلية 100% مع ضمان رسمي من جبور فون",
      whatsapp: "هل تحتاج مساعدة؟ تحدث مباشرة مع خدمة العملاء عبر واتساب"
    },
    hero: {
      badge: "أحدث العروض الحصرية",
      title: "أفضل الهواتف الذكية والإكسسوارات في المغرب",
      subtitle:
        "اكتشف تشكيلتنا المختارة من الهواتف الذكية المعتمدة، الإكسسوارات الأصلية والأجهزة الإلكترونية بأفضل الأسعار مع توصيل سريع.",
      ctaShop: "تصفح المنتجات",
      ctaPromo: "عروض اليوم"
    },
    features: {
      shippingTitle: "توصيل سريع",
      shippingDesc: "توصيل لجميع مدن المغرب خلال 24 إلى 48 ساعة",
      warrantyTitle: "ضمان رسمي معتمد",
      warrantyDesc: "ضمان حقيقي وخدمة ما بعد البيع متميزة",
      paymentTitle: "الدفع عند الاستلام",
      paymentDesc: "ادفع نقداً بعد معاينة واستلام طلبك",
      genuineTitle: "منتجات أصلية 100%",
      genuineDesc: "أجهزة أصلية مضمونة جديدة ومجددة بعناية"
    },
    shop: {
      title: "متجر جبور فون",
      subtitle: "تصفح تشكيلتنا الشاملة من الهواتف الذكية والأجهزة اللوحية والإكسسوارات المعتمدة.",
      filters: "تصفية المنتجات",
      categories: "الفئات",
      brands: "العلامات التجارية",
      priceRange: "نطاق السعر",
      clearFilters: "إعادة ضبط",
      sortBy: "ترتيب حسب",
      sortFeatured: "المختارة والمميزة",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      sortRating: "الأعلى تقييماً",
      inStock: "متوفر",
      outOfStock: "نفد المخزون",
      lowStock: "كمية محدودة",
      sale: "تخفيض",
      newBadge: "جديد",
      addToCart: "أضف إلى السلة",
      viewDetails: "التفاصيل"
    },
    product: {
      specifications: "المواصفات التقنية",
      description: "وصف المنتج",
      reviews: "تقييمات المشترين",
      condition: "الحالة",
      storage: "سعة التخزين",
      ram: "الذاكرة العشوائية (RAM)",
      color: "اللون",
      screen: "الشاشة",
      battery: "البطارية",
      camera: "الكاميرا",
      processor: "المعالج",
      network: "الشبكة",
      warranty: "الضمان",
      quantity: "الكمية",
      orderOnWhatsapp: "طلب مباشر عبر واتساب"
    },
    cart: {
      title: "سلة المشتريات",
      empty: "سلة المشتريات فارغة",
      emptyDesc: "استكشف تشكيلتنا الواسعة وابدأ التسوق الآن!",
      startShopping: "ابدأ التسوق الآن",
      subtotal: "المجموع الفرعي",
      discount: "الخصم",
      shipping: "مصاريف التوصيل",
      total: "المجموع الإجمالي",
      couponCode: "كود الخصم",
      apply: "تطبيق",
      checkout: "متابعة الطلب",
      freeShippingProgress: "أضف منتجات بقيمة {amount} إضافية للحصول على",
      freeShippingBadge: "التوصيل المجاني!"
    },
    checkout: {
      title: "إتمام عملية الشراء",
      contactInfo: "معلومات التوصيل والاستلام",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف المحمول (المغرب)",
      email: "البريد الإلكتروني (اختياري)",
      city: "المدينة",
      address: "عنوان التوصيل بالتفصيل",
      notes: "ملاحظات إضافية لمندوب التوصيل",
      paymentMethod: "طريقة الدفع",
      codTitle: "الدفع نقداً عند الاستلام (Cash on Delivery)",
      codDesc: "لا تدفع أي مبلغ حتى تستلم طلبك وتتحقق منه بنفسك.",
      confirmOrder: "تأكيد الطلب الآن",
      orderSuccess: "شكراً لطلبك من جبور فون!",
      orderPlacedDesc:
        "تم تسجيل طلبك رقم #{orderNumber} بنجاح. سيتصل بك فريقنا لتأكيد العنوان وموعد التوصيل.",
      whatsappConfirm: "تأكيد فوري عبر واتساب"
    },
    tracking: {
      title: "تتبع شحنتك",
      subtitle: "أدخل رقم الطلب ورقم هاتفك للتحقق من حالة وصول الشحنة.",
      orderNumber: "رقم الطلب (مثال: JP-2611-1234)",
      contact: "رقم الهاتف أو البريد الإلكتروني",
      searchBtn: "تتبع الطلب",
      status: "حالة الطلب",
      statusPending: "قيد الانتظار والمراجعة",
      statusConfirmed: "تم تأكيد الطلب",
      statusProcessing: "قيد التجهيز والتغليف",
      statusShipped: "تم تسليم الشحنة لشركة التوصيل",
      statusDelivered: "تم التوصيل بنجاح",
      statusCancelled: "تم إلغاء الطلب",
      statusReturned: "تم إرجاع الشحنة"
    },
    footer: {
      aboutStore:
        "جبور فون هي وجهتك الموثوقة في المغرب للحصول على الهواتف الذكية الأصلية، الأجهزة اللوحية والإكسسوارات مع ضمان معتمد.",
      quickLinks: "روابط سريعة",
      customerService: "خدمة العملاء",
      newsletterTitle: "النشرة البريدية",
      newsletterDesc: "اشترك لتصلك أحدث العروض الحصرية وتخفيضات الهواتف.",
      newsletterPlaceholder: "أدخل بريدك الإلكتروني...",
      subscribe: "اشتراك",
      copyright: "جميع الحقوق محفوظة. جبور فون المغرب."
    }
  }
};
