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
    matchingProducts: string;
    typeMinChars: string;
  };
  common: {
    free: string;
    loading: string;
    save: string;
    dirham: string;
    allCategories: string;
    currencySymbol: string;
    added: string;
    back: string;
    close: string;
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
  home: {
    featuredCategories: string;
    shopByDepartment: string;
    shopByDepartmentDesc: string;
    highestRated: string;
    highestRatedDesc: string;
    browseAll: string;
    explore: string;
    productsCount: string;
  };
  shop: {
    title: string;
    subtitle: string;
    filters: string;
    categories: string;
    brands: string;
    allBrands: string;
    priceRange: string;
    clearFilters: string;
    filtersActive: string;
    sortBy: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    sortAlpha: string;
    inStock: string;
    outOfStock: string;
    lowStock: string;
    sale: string;
    newBadge: string;
    addToCart: string;
    viewDetails: string;
    noProducts: string;
    productsCount: string;
    minPrice: string;
    maxPrice: string;
    allDepartments: string;
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
    addedToCart: string;
    relatedDevices: string;
    genuinePromise: string;
    noReviewsYet: string;
    verifiedReviews: string;
    submitReview: string;
    yourRating: string;
    yourName: string;
    yourComment: string;
    submitBtn: string;
    onlyLeft: string;
    inStockCount: string;
    fastDelivery: string;
    officialWarranty: string;
    freeReturnSupport: string;
    conditionNew: string;
    conditionRefurbished: string;
    conditionUsed: string;
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
    continueShopping: string;
    removeCoupon: string;
    couponApplied: string;
    finish: string;
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
    selectCity: string;
    otherCity: string;
  };
  tracking: {
    title: string;
    subtitle: string;
    orderNumber: string;
    contact: string;
    contactPlaceholder: string;
    searchBtn: string;
    status: string;
    statusPending: string;
    statusConfirmed: string;
    statusProcessing: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
    statusReturned: string;
    orderFound: string;
    orderCancelledAlert: string;
    orderCancelledHelp: string;
    lookupError: string;
    requiredFields: string;
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
  pages: {
    about: {
      promiseBadge: string;
      title: string;
      subtitle: string;
      pillar1Title: string;
      pillar1Desc: string;
      pillar2Title: string;
      pillar2Desc: string;
      pillar3Title: string;
      pillar3Desc: string;
      ctaTitle: string;
      ctaDesc: string;
      ctaButton: string;
    };
    contact: {
      badge: string;
      title: string;
      subtitle: string;
      phoneTitle: string;
      phoneDesc: string;
      whatsappTitle: string;
      whatsappDesc: string;
      emailTitle: string;
      emailDesc: string;
      showroomTitle: string;
      hoursTitle: string;
      hoursWeekdays: string;
      hoursSaturday: string;
      hoursSunday: string;
      formTitle: string;
      formSubtitle: string;
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      subjectLabel: string;
      messageLabel: string;
      sendBtn: string;
      successMsg: string;
    };
    faq: {
      title: string;
      subtitle: string;
      catOrders: string;
      catQuality: string;
      catDelivery: string;
      catWarranty: string;
      needMoreHelp: string;
      whatsappCta: string;
    };
    shipping: {
      badge: string;
      title: string;
      subtitle: string;
      nextDayTitle: string;
      nextDayDesc: string;
      codTitle: string;
      codDesc: string;
      insuredTitle: string;
      insuredDesc: string;
      zonesTitle: string;
      zonesDesc: string;
      processTitle: string;
      processDesc: string;
    };
    returns: {
      badge: string;
      title: string;
      subtitle: string;
      exchangeTitle: string;
      exchangeDesc: string;
      warrantyTitle: string;
      warrantyDesc: string;
      eligibilityTitle: string;
      eligibilityDesc: string;
      processTitle: string;
      processDesc: string;
    };
    privacy: {
      badge: string;
      title: string;
      subtitle: string;
      s1Title: string;
      s1Desc: string;
      s2Title: string;
      s2Desc: string;
      s3Title: string;
      s3Desc: string;
    };
    terms: {
      badge: string;
      title: string;
      subtitle: string;
      s1Title: string;
      s1Desc: string;
      s2Title: string;
      s2Desc: string;
      s3Title: string;
      s3Desc: string;
      s4Title: string;
      s4Desc: string;
    };
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
      searchEsc: "Échap",
      noResults: "Aucun produit trouvé pour",
      cartTitle: "Mon Panier",
      matchingProducts: "Produits correspondants",
      typeMinChars: "Tapez au moins 2 caractères pour lancer la recherche instantanée."
    },
    common: {
      free: "GRATUIT",
      loading: "Chargement...",
      save: "Économisez",
      dirham: "DH",
      allCategories: "Toutes les catégories",
      currencySymbol: "DH",
      added: "Ajouté !",
      back: "Retour",
      close: "Fermer"
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
    home: {
      featuredCategories: "Catégories en Vedette",
      shopByDepartment: "Nos Rayons",
      shopByDepartmentDesc: "Sélection certifiée avec spécifications authentiques sur chaque modèle.",
      highestRated: "Les Mieux Notés",
      highestRatedDesc: "Les appareils les plus plébiscités par nos clients à travers le Maroc.",
      browseAll: "Tout Afficher",
      explore: "Découvrir",
      productsCount: "produits"
    },
    shop: {
      title: "Notre Catalogue",
      subtitle: "Parcourez notre gamme complète de smartphones, tablettes et accessoires certifiés.",
      filters: "Filtres",
      categories: "Rayons",
      brands: "Marques",
      allBrands: "Toutes les marques",
      priceRange: "Fourchette de prix",
      clearFilters: "Réinitialiser les filtres",
      filtersActive: "Filtres actifs",
      sortBy: "Trier par",
      sortFeatured: "En vedette",
      sortPriceAsc: "Prix : croissant",
      sortPriceDesc: "Prix : décroissant",
      sortRating: "Mieux notés",
      sortAlpha: "Alphabétique",
      inStock: "En stock",
      outOfStock: "Rupture de stock",
      lowStock: "Stock limité",
      sale: "Promo",
      newBadge: "Nouveau",
      addToCart: "Ajouter au panier",
      viewDetails: "Voir fiche",
      noProducts: "Aucun produit ne correspond à vos filtres actifs.",
      productsCount: "produits disponibles dans la boutique.",
      minPrice: "Min",
      maxPrice: "Max",
      allDepartments: "Tous les rayons"
    },
    product: {
      specifications: "Fiche technique",
      description: "Description",
      reviews: "Avis vérifiés",
      condition: "État",
      storage: "Capacité",
      ram: "Mémoire RAM",
      color: "Couleur / Finition",
      screen: "Écran",
      battery: "Batterie",
      camera: "Appareil photo",
      processor: "Processeur",
      network: "Réseau",
      warranty: "Garantie",
      quantity: "Quantité",
      orderOnWhatsapp: "Commander directement via WhatsApp",
      addedToCart: "Ajouté au panier avec succès",
      relatedDevices: "Appareils similaires recommandés",
      genuinePromise: "Appareil 100% Authentique · Aucun avis client pour le moment",
      noReviewsYet: "Soyez le premier à donner votre avis !",
      verifiedReviews: "avis vérifiés",
      submitReview: "Laisser un avis vérifié",
      yourRating: "Votre note",
      yourName: "Votre nom complet",
      yourComment: "Votre commentaire ou retour d'expérience",
      submitBtn: "Publier mon avis",
      onlyLeft: "Plus que {count} exemplaires en stock !",
      inStockCount: "En stock ({count} disponibles)",
      fastDelivery: "Livraison express 24-48h",
      officialWarranty: "Garantie officielle 1 an",
      freeReturnSupport: "Échange & SAV dédié",
      conditionNew: "Neuf scellé",
      conditionRefurbished: "Reconditionné certifié",
      conditionUsed: "Occasion vérifiée"
    },
    cart: {
      title: "Mon Panier",
      empty: "Votre panier est vide",
      emptyDesc: "Découvrez notre catalogue de smartphones et d'accessoires certifiés !",
      startShopping: "Découvrir la boutique",
      subtotal: "Sous-total",
      discount: "Remise appliquée",
      shipping: "Frais de livraison",
      total: "Total à payer (Paiement à la livraison)",
      couponCode: "Code promo",
      apply: "Appliquer",
      checkout: "Passer la commande",
      freeShippingProgress: "Ajoutez {amount} supplémentaires pour obtenir la",
      freeShippingBadge: "Livraison Gratuite !",
      continueShopping: "Continuer mes achats",
      removeCoupon: "Retirer",
      couponApplied: "Code appliqué avec succès !",
      finish: "Finition"
    },
    checkout: {
      title: "Finaliser votre commande",
      contactInfo: "Vos Coordonnées de Livraison",
      fullName: "Nom et prénom *",
      phone: "Numéro de téléphone portable (Maroc) *",
      email: "Adresse e-mail (optionnelle)",
      city: "Ville de destination *",
      address: "Adresse complète de livraison *",
      notes: "Instructions ou repères pour le livreur (ex: étage, quartier)",
      paymentMethod: "Mode de règlement",
      codTitle: "Paiement à la livraison (Cash on Delivery)",
      codDesc: "Vous ne payez en espèces qu'après réception et vérification physique de votre colis.",
      confirmOrder: "Confirmer ma commande",
      orderSuccess: "Merci pour votre commande !",
      orderPlacedDesc:
        "Votre commande #{orderNumber} a été enregistrée avec succès. Notre service de livraison vous contactera avant le passage du coursier.",
      whatsappConfirm: "Accélérer la confirmation sur WhatsApp",
      selectCity: "Sélectionnez votre ville",
      otherCity: "Autre ville / Région"
    },
    tracking: {
      title: "Suivre votre commande",
      subtitle: "Suivez l'acheminement de votre colis en temps réel avec votre numéro de commande.",
      orderNumber: "Numéro de commande (ex: JP-2611-1234)",
      contact: "Téléphone ou e-mail associé",
      contactPlaceholder: "Le numéro ou e-mail saisi lors de votre commande",
      searchBtn: "Rechercher la commande",
      status: "Statut actuel",
      statusPending: "En attente de confirmation",
      statusConfirmed: "Commande confirmée",
      statusProcessing: "En cours de préparation",
      statusShipped: "En cours de livraison",
      statusDelivered: "Colis livré",
      statusCancelled: "Commande annulée",
      statusReturned: "Colis retourné",
      orderFound: "Commande trouvée",
      orderCancelledAlert: "Cette commande a été annulée.",
      orderCancelledHelp: "Les articles ont été réintégrés au stock. Si vous avez des questions, notre support WhatsApp reste à votre disposition.",
      lookupError: "Erreur de recherche",
      requiredFields: "Veuillez renseigner le numéro de commande et vos coordonnées."
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
    },
    pages: {
      about: {
        promiseBadge: "L'Engagement Jabour Phone",
        title: "La Technologie en Toute Confiance.",
        subtitle:
          "Jabour Phone a été créé avec une mission claire : proposer des smartphones et des équipements électroniques 100% authentiques avec des prix transparents, des garanties officielles et un service client local irréprochable.",
        pillar1Title: "100% Authentique Garanti",
        pillar1Desc:
          "Chaque appareil provient de circuits de distribution officiels certifiés, avec numéro IMEI vérifié et compatibilité totale avec les réseaux marocains.",
        pillar2Title: "Contrôle Qualité Multipoints",
        pillar2Desc:
          "Avant d'être mis en vente, nos techniciens inspectent minutieusement l'état de la batterie, l'écran, les caméras, la connectivité et les composants internes.",
        pillar3Title: "Garantie & Service Local",
        pillar3Desc:
          "Nous assurons un suivi direct et réactif via notre service après-vente et notre support WhatsApp, sans intermédiaire ni formalités compliquées.",
        ctaTitle: "Prêt à trouver votre nouveau smartphone ?",
        ctaDesc: "Explorez notre catalogue complet d'appareils garantis avec paiement à la livraison.",
        ctaButton: "Découvrir la boutique"
      },
      contact: {
        badge: "Service Client Direct",
        title: "Contactez Notre Équipe",
        subtitle:
          "Une question sur la fiche d'un smartphone, la disponibilité d'une couleur, la garantie ou le suivi de votre commande ? Notre équipe vous répond immédiatement.",
        phoneTitle: "Téléphone",
        phoneDesc: "Disponible du lundi au samedi de 9h à 19h",
        whatsappTitle: "WhatsApp Direct",
        whatsappDesc: "Réponse rapide pour vos commandes et conseils",
        emailTitle: "E-mail officiel",
        emailDesc: "Pour vos demandes de partenariat et devis",
        showroomTitle: "Showroom & Boutique",
        hoursTitle: "Horaires d'Ouverture",
        hoursWeekdays: "Lundi - Vendredi : 09:00 - 19:30",
        hoursSaturday: "Samedi : 10:00 - 19:00",
        hoursSunday: "Dimanche : Fermé",
        formTitle: "Envoyez-nous un message",
        formSubtitle: "Remplissez ce formulaire et nous vous recontacterons rapidement.",
        nameLabel: "Nom complet *",
        emailLabel: "Adresse e-mail *",
        phoneLabel: "Numéro de téléphone",
        subjectLabel: "Objet de votre demande",
        messageLabel: "Votre message *",
        sendBtn: "Envoyer le message",
        successMsg: "Votre message a été transmis avec succès ! Notre équipe vous répondra dans les plus brefs délais."
      },
      faq: {
        title: "Questions Fréquentes (FAQ)",
        subtitle: "Retrouvez les réponses à toutes vos questions sur les commandes, les paiements, la livraison et les garanties.",
        catOrders: "Commandes & Paiement",
        catQuality: "Authenticité & Qualité",
        catDelivery: "Livraison & Suivi",
        catWarranty: "Garantie & SAV",
        needMoreHelp: "Vous avez une autre question spécifique ?",
        whatsappCta: "Poser ma question sur WhatsApp"
      },
      shipping: {
        badge: "Logistique & Livraison Sécurisée",
        title: "Livraison & Expédition",
        subtitle: "Livraison rapide et assurée dans toutes les villes du Maroc avec vérification physique de votre colis.",
        nextDayTitle: "Expédition Sous 24h",
        nextDayDesc: "Toute commande confirmée avant 16h est préparée, emballée soigneusement et expédiée le jour même.",
        codTitle: "Paiement à la Livraison",
        codDesc: "Zéro risque. Vous réglez en espèces auprès du livreur uniquement après avoir reçu votre colis.",
        insuredTitle: "Colis Assuré & Sécurisé",
        insuredDesc: "Tous nos téléphones sont scellés dans un emballage anti-choc et assurés durant tout le trajet.",
        zonesTitle: "Délais par Zone",
        zonesDesc: "Casablanca et Rabat : 24h. Autres grandes villes (Marrakech, Fès, Tanger, Agadir) : 24h à 48h. Autres régions : 48h à 72h.",
        processTitle: "Comment se déroule la livraison ?",
        processDesc: "1) Vous passez commande. 2) Notre équipe vous appelle pour valider l'adresse. 3) Le livreur vous contacte avant le passage."
      },
      returns: {
        badge: "Protection & Sérénité Client",
        title: "Retours & Garantie Officielle",
        subtitle: "Tous nos appareils sont couverts par notre garantie officielle et un droit d'échange sous 14 jours en cas de défaut.",
        exchangeTitle: "Échange Sous 14 Jours",
        exchangeDesc: "Si votre appareil présente un problème technique à la réception, nous procédons à son échange immédiat.",
        warrantyTitle: "Garantie Officielle 1 An",
        warrantyDesc: "Prise en charge intégrale des pièces et main d'œuvre pour toute panne matérielle durant 12 mois.",
        eligibilityTitle: "Conditions d'éligibilité",
        eligibilityDesc: "L'appareil doit être retourné avec ses accessoires complets, sans choc physique ni trace d'oxydation.",
        processTitle: "Comment faire une demande de SAV ?",
        processDesc: "Contactez-nous directement sur WhatsApp avec votre numéro de commande et une courte vidéo du problème constaté."
      },
      privacy: {
        badge: "Protection des Données & Confidentialité",
        title: "Politique de Confidentialité",
        subtitle: "Nous protégeons scrupuleusement la confidentialité de vos informations personnelles et coordonnées de livraison.",
        s1Title: "1. Données collectées",
        s1Desc: "Nous collectons uniquement votre nom, adresse de livraison, téléphone et e-mail nécessaires à la livraison de vos commandes.",
        s2Title: "2. Utilisation des données",
        s2Desc: "Vos données ne sont jamais vendues ni cédées à des tiers. Elles servent exclusivement à l'acheminement de vos colis et au SAV.",
        s3Title: "3. Sécurité de stockage",
        s3Desc: "Nos bases de données sont sécurisées selon les standards les plus stricts avec chiffrement des données sensibles."
      },
      terms: {
        badge: "Cadre Légal & Conditions",
        title: "Conditions Générales de Vente",
        subtitle: "Veuillez lire attentivement les conditions régissant vos achats et commandes sur la boutique Jabour Phone.",
        s1Title: "1. Objet et Acceptation",
        s1Desc: "Toute commande passée sur notre site ou via notre WhatsApp officiel implique l'adhésion complète aux présentes conditions.",
        s2Title: "2. Prix et Disponibilité",
        s2Desc: "Nos prix sont affichés en Dirhams marocains (DH) et correspondent à des stocks réels vérifiés.",
        s3Title: "3. Modalités de Commande",
        s3Desc: "Le contrat de vente est validé après confirmation téléphonique ou via WhatsApp par nos conseillers.",
        s4Title: "4. Droit Applicable",
        s4Desc: "Les présentes conditions sont soumises à la législation marocaine en vigueur régissant le commerce électronique."
      }
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
      searchEsc: "خروج",
      noResults: "لم يتم العثور على أي منتج لـ",
      cartTitle: "سلة التسوق",
      matchingProducts: "المنتجات المطابقة",
      typeMinChars: "اكتب حرفين على الأقل للبحث الفوري التلقائي."
    },
    common: {
      free: "مجاناً",
      loading: "جاري التحميل...",
      save: "وفّر",
      dirham: "د.م.",
      allCategories: "جميع الفئات",
      currencySymbol: "د.م.",
      added: "تمت الإضافة !",
      back: "رجوع",
      close: "إغلاق"
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
    home: {
      featuredCategories: "الفئات المميزة",
      shopByDepartment: "تسوق حسب الأقسام",
      shopByDepartmentDesc: "أجهزة أصلية معتمدة بمواصفات المصنع الدقيقة على كل منتج.",
      highestRated: "الأعلى تقييماً",
      highestRatedDesc: "الأجهزة الإلكترونية الأكثر طلباً وإشادة من زبائننا في المغرب.",
      browseAll: "عرض الكل",
      explore: "استكشف",
      productsCount: "منتج"
    },
    shop: {
      title: "متجر جبور فون",
      subtitle: "تصفح تشكيلتنا الشاملة من الهواتف الذكية والأجهزة اللوحية والإكسسوارات المعتمدة.",
      filters: "تصفية المنتجات",
      categories: "الأقسام",
      brands: "العلامات التجارية",
      allBrands: "جميع العلامات التجارية",
      priceRange: "نطاق السعر",
      clearFilters: "إلغاء جميع الفلاتر",
      filtersActive: "فلاتر مفعلة",
      sortBy: "ترتيب حسب",
      sortFeatured: "المختارة والمميزة",
      sortPriceAsc: "السعر: من الأقل للأعلى",
      sortPriceDesc: "السعر: من الأعلى للأقل",
      sortRating: "الأعلى تقييماً",
      sortAlpha: "أبجدياً",
      inStock: "متوفر",
      outOfStock: "نفد المخزون",
      lowStock: "كمية محدودة",
      sale: "تخفيض",
      newBadge: "جديد",
      addToCart: "أضف إلى السلة",
      viewDetails: "التفاصيل",
      noProducts: "لا توجد منتجات تطابق الفلاتر المحددة حالياً.",
      productsCount: "منتجات متوفرة في المتجر.",
      minPrice: "الأدنى",
      maxPrice: "الأقصى",
      allDepartments: "جميع الأقسام"
    },
    product: {
      specifications: "المواصفات التقنية",
      description: "وصف المنتج",
      reviews: "تقييمات المشترين",
      condition: "الحالة",
      storage: "سعة التخزين",
      ram: "الذاكرة العشوائية (RAM)",
      color: "اللون / اللمسة",
      screen: "الشاشة",
      battery: "البطارية",
      camera: "الكاميرا",
      processor: "المعالج",
      network: "الشبكة",
      warranty: "الضمان",
      quantity: "الكمية",
      orderOnWhatsapp: "طلب مباشر عبر واتساب",
      addedToCart: "تمت إضافة المنتج إلى السلة بنجاح",
      relatedDevices: "أجهزة مشابهة قد تعجبك",
      genuinePromise: "جهاز أصلي 100% مضمون · لا توجد مراجعات حتى الآن",
      noReviewsYet: "كن أول من يكتب تقييماً لهذا الجهاز !",
      verifiedReviews: "تقييمات موثقة",
      submitReview: "أضف تقييمك للمنتج",
      yourRating: "تقييمك بالنجوم",
      yourName: "الاسم الكامل",
      yourComment: "رأيك في الجهاز وتجربتك معه",
      submitBtn: "إرسال التقييم",
      onlyLeft: "تبقى {count} قطع فقط في المخزون !",
      inStockCount: "متوفر بالمخزون ({count} متوفرة)",
      fastDelivery: "توصيل سريع 24-48 ساعة",
      officialWarranty: "ضمان رسمي لمدة عام كامل",
      freeReturnSupport: "إمكانية الاستبدال والدعم",
      conditionNew: "جديد أصلي بالعلبة",
      conditionRefurbished: "مجدد معتمد بحالة ممتازة",
      conditionUsed: "مستعمل أصلي تم فحصه"
    },
    cart: {
      title: "سلة المشتريات",
      empty: "سلة المشتريات فارغة",
      emptyDesc: "استكشف تشكيلتنا الواسعة وابدأ التسوق الآن!",
      startShopping: "ابدأ التسوق الآن",
      subtotal: "المجموع الفرعي",
      discount: "الخصم المطبق",
      shipping: "مصاريف التوصيل",
      total: "المجموع الإجمالي (الدفع عند الاستلام)",
      couponCode: "كود الخصم",
      apply: "تطبيق",
      checkout: "متابعة الطلب",
      freeShippingProgress: "أضف منتجات بقيمة {amount} إضافية للحصول على",
      freeShippingBadge: "التوصيل المجاني!",
      continueShopping: "مواصلة التسوق",
      removeCoupon: "حذف",
      couponApplied: "تم تفعيل كود الخصم بنجاح !",
      finish: "اللون"
    },
    checkout: {
      title: "إتمام عملية الشراء",
      contactInfo: "معلومات التوصيل والاستلام",
      fullName: "الاسم الكامل *",
      phone: "رقم الهاتف المحمول (المغرب) *",
      email: "البريد الإلكتروني (اختياري)",
      city: "المدينة *",
      address: "عنوان التوصيل بالتفصيل *",
      notes: "ملاحظات أو علامات إرشادية لمندوب التوصيل",
      paymentMethod: "طريقة الدفع",
      codTitle: "الدفع نقداً عند الاستلام (Cash on Delivery)",
      codDesc: "لا تدفع أي مبلغ حتى تستلم طلبك وتتحقق منه بنفسك عند باب بيتك.",
      confirmOrder: "تأكيد الطلب الآن",
      orderSuccess: "شكراً لطلبك من جبور فون!",
      orderPlacedDesc:
        "تم تسجيل طلبك رقم #{orderNumber} بنجاح. سيتصل بك فريقنا لتأكيد العنوان وموعد التوصيل.",
      whatsappConfirm: "تأكيد فوري عبر واتساب",
      selectCity: "اختر مدينتك",
      otherCity: "مدينة أخرى / منطقة أخرى"
    },
    tracking: {
      title: "تتبع شحنتك",
      subtitle: "أدخل رقم الطلب ورقم هاتفك للتحقق من حالة وصول الشحنة لحظة بلحظة.",
      orderNumber: "رقم الطلب (مثال: JP-2611-1234)",
      contact: "رقم الهاتف أو البريد الإلكتروني",
      contactPlaceholder: "الهاتف أو البريد المسجل أثناء تقديم الطلب",
      searchBtn: "تتبع حالة الشحنة",
      status: "حالة الطلب",
      statusPending: "قيد الانتظار والمراجعة",
      statusConfirmed: "تم تأكيد الطلب",
      statusProcessing: "قيد التجهيز والتغليف",
      statusShipped: "تم تسليم الشحنة لشركة التوصيل",
      statusDelivered: "تم التوصيل بنجاح",
      statusCancelled: "تم إلغاء الطلب",
      statusReturned: "تم إرجاع الشحنة",
      orderFound: "تم العثور على الطلب",
      orderCancelledAlert: "تم إلغاء هذا الطلب.",
      orderCancelledHelp: "تمت إعادة المنتجات إلى المخزون. إذا كان لديك استفسار، تواصل معنا فوراً عبر واتساب.",
      lookupError: "خطأ في البحث",
      requiredFields: "يرجى إدخال رقم الطلب ومعلومات الاتصال كاملة."
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
    },
    pages: {
      about: {
        promiseBadge: "عهد جبور فون للزبائن",
        title: "التكنولوجيا بكل مصداقية وشفافية.",
        subtitle:
          "تأسست جبور فون بهدف واحد واضح: تقديم أحدث الهواتف الذكية والأجهزة الإلكترونية الأصلية 100% بأسعار عادلة، مع ضمانات معتمدة وخدمة عملاء محلية متميزة.",
        pillar1Title: "منتجات أصلية 100% مضمونة",
        pillar1Desc:
          "جميع أجهزتنا معتمدة من المصنع ومستوردة عبر قنوات رسمية، مع مطابقة كاملة لأرقام IMEI والتوافق مع شبكات الاتصال المغربية.",
        pillar2Title: "فحص فني شامل ودقيق",
        pillar2Desc:
          "يقوم فريقنا التقني بفحص صحة البطارية، استجابة الشاشة، دقة الكاميرات، الشحن والاتصال قبل إرسال أي جهاز إلى الزبون.",
        pillar3Title: "ضمان حقيقي ودعم محلي",
        pillar3Desc:
          "نوفر خدمة ما بعد البيع والدعم المباشر عبر واتساب دون تعقيدات أو وسائط، لراحتكم التامة.",
        ctaTitle: "هل أنت جاهز لاختيار هاتفك القادم ؟",
        ctaDesc: "تصفح تشكيلتنا الكاملة من الهواتف الأصلية مع ميزة الدفع عند الاستلام والتوصيل السريع.",
        ctaButton: "تصفح المتجر الآن"
      },
      contact: {
        badge: "خدمة الزبائن المباشرة",
        title: "تواصل مع فريقنا المتخصص",
        subtitle:
          "لديك أي استفسار حول مواصفات هاتف، توفر لون معين، الضمان أو رغبة في استشارة فنية؟ فريقنا جاهز لمساعدتك في أي وقت.",
        phoneTitle: "الاتصال الهاتفي",
        phoneDesc: "متاح من الإثنين إلى السبت من 9:00 صباحاً إلى 7:00 مساءً",
        whatsappTitle: "واتساب المباشر",
        whatsappDesc: "استجابة سريعة للطلبات والاستفسارات والمتابعة",
        emailTitle: "البريد الإلكتروني الرسمي",
        emailDesc: "لطلبات الجملة والشراكات والاستفسارات العامة",
        showroomTitle: "معرضنا في الدار البيضاء",
        hoursTitle: "مواعيد العمل",
        hoursWeekdays: "الإثنين - الجمعة : 09:00 - 19:30",
        hoursSaturday: "السبت : 10:00 - 19:00",
        hoursSunday: "الأحد : عطلة أسبوعية",
        formTitle: "أرسل لنا استفسارك مباشرة",
        formSubtitle: "املأ البيانات أدناه وسيتواصل معك مستشارنا بأقرب وقت.",
        nameLabel: "الاسم الكامل *",
        emailLabel: "البريد الإلكتروني *",
        phoneLabel: "رقم الهاتف المحمول",
        subjectLabel: "موضوع الرسالة",
        messageLabel: "رسالتك بالتفصيل *",
        sendBtn: "إرسال الرسالة الآن",
        successMsg: "تم إرسال رسالتك بنجاح ! سيتواصل معك فريق خدمة العملاء قريباً."
      },
      faq: {
        title: "الأسئلة الشائعة (FAQ)",
        subtitle: "إليك إجابات واضحة ومفصلة عن أكثر الأسئلة طرحاً بخصوص الطلب، الشحن، الدفع والضمان.",
        catOrders: "الطلب وطرق الدفع",
        catQuality: "الجودة والأصالة",
        catDelivery: "الشحن والتوصيل",
        catWarranty: "الضمان وما بعد البيع",
        needMoreHelp: "هل لديك سؤال آخر لم تجد إجابته هنا ؟",
        whatsappCta: "تحدث معنا عبر واتساب الآن"
      },
      shipping: {
        badge: "لوجستيات التوصيل الآمن",
        title: "الشحن والتوصيل بالمغرب",
        subtitle: "توصيل سريع ومؤمن لجميع المدن والجهات المغربية مع حق معاينة الطرد قبل الدفع.",
        nextDayTitle: "شحن سريع خلال 24 ساعة",
        nextDayDesc: "يتم فحص وتغليف وتجهيز كافة الطلبات المؤكدة قبل الساعة الرابعة عصراً للشحن في نفس اليوم.",
        codTitle: "الدفع عند الاستلام (COD)",
        codDesc: "تسوق بكل راحة واطمئنان، لا تدفع أي درهم حتى يصلك الموزع لباب بيتك وتستلم طردك.",
        insuredTitle: "طرد مؤمن ومحمي بالكامل",
        insuredDesc: "جميع أجهزتنا مغلفة بعناية بأغلفة مقاومة للصدمات مع ضمان الاستبدال الفوري في حال أي ضرر أثناء النقل.",
        zonesTitle: "مدة التوصيل حسب المناطق",
        zonesDesc: "الدار البيضاء والرباط: 24 ساعة. المدن الكبرى (فاس، مراكش، طنجة، أكادير): 24 إلى 48 ساعة. باقي المدن: 48 إلى 72 ساعة.",
        processTitle: "كيف تتم عملية التوصيل ؟",
        processDesc: "1) تقدم طلبك. 2) يتصل بك فريقنا لتأكيد العنوان. 3) يتواصل معك الموزع لتحديد وقت الوصول."
      },
      returns: {
        badge: "حماية الزبون والضمان المعتمد",
        title: "سياسة الإرجاع والضمان",
        subtitle: "جميع أجهزتنا مشمولة بضمان رسمي حقيقي مع إمكانية استبدال الجهاز خلال 14 يوماً في حالة وجود أي عيب مصنعي.",
        exchangeTitle: "حق الاستبدال خلال 14 يوماً",
        exchangeDesc: "إذا لاحظت أي خلل فني في الجهاز عند الاستلام، نقوم باستبداله فوراً بجهاز جديد دون مماطلة.",
        warrantyTitle: "ضمان رسمي معتمد لمدة سنة",
        warrantyDesc: "تغطية كاملة لقطع الغيار والصيانة لجميع الأعطال الفنية واللوحة الأم والشاشة لمدة 12 شهراً.",
        eligibilityTitle: "شروط قبول الإرجاع",
        eligibilityDesc: "يشترط إعادة الجهاز بحالته الأصلية بجميع ملحقاته وعلبته، ودون وجود أي كسر أو دخول سوائل.",
        processTitle: "كيف أطلب خدمة الضمان أو الاستبدال ؟",
        processDesc: "راسلنا على واتساب مع ذكر رقم طلبك ومقطع فيديو يوضح المشكلة، وسيتولى فريقنا التقني الترتيب معك."
      },
      privacy: {
        badge: "حماية البيانات والسرية التامة",
        title: "سياسة الخصوصية",
        subtitle: "نحن نحترم خصوصية زبائننا ونلتزم بحماية كافة البيانات الشخصية ومعلومات التوصيل.",
        s1Title: "1. البيانات التي نجمعها",
        s1Desc: "نجمع فقط الاسم، رقم الهاتف، العنوان والبريد الإلكتروني اللازمة لتسليم طلبك وتقديم خدمات الضمان.",
        s2Title: "2. كيفية استخدام بياناتك",
        s2Desc: "لا نقوم بمشاركة أو بيع بياناتك لأي طرف ثالث، وتستخدم فقط لإرسال الشحنات وتأكيد مواعيد التوصيل.",
        s3Title: "3. أمان وحماية البيانات",
        s3Desc: "نطبق أفضل تدابير الأمان التقنية والتشفير لحماية بيانات الزبائن من أي وصول غير مصرح به."
      },
      terms: {
        badge: "الإطار القانوني والشروط",
        title: "الشروط والأحكام العامة",
        subtitle: "يرجى قراءة هذه الشروط بعناية قبل إتمام أي طلب عبر متجر جبور فون الإلكتروني.",
        s1Title: "1. الموافقة على الشروط",
        s1Desc: "إتمامك للطلب عبر المتجر أو الواتساب الرسمي يعتبر موافقة صريحة على بنود البيع والضمان المذكورة.",
        s2Title: "2. الأسعار وتوفر المنتجات",
        s2Desc: "الأسعار معروضة بالدرهم المغربي (د.م.) وتعكس المخزون الفعلي المتوفر في مستودعاتنا.",
        s3Title: "3. تأكيد وتنفيذ الطلبات",
        s3Desc: "يتم اعتماد الطلب نهائياً بعد مراجعة فريق خدمة العملاء وتأكيد العنوان عبر الهاتف أو الواتساب.",
        s4Title: "4. القانون المطبق",
        s4Desc: "تخضع هذه الشروط والأحكام للقوانين والأنظمة المعمول بها في المملكة المغربية في مجال التجارة الإلكترونية."
      }
    }
  }
};
