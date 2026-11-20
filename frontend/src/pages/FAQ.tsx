import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";

interface FAQItem {
  questionFr: string;
  questionAr: string;
  answerFr: string;
  answerAr: string;
  categoryFr: string;
  categoryAr: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    categoryFr: "Commandes & Paiement",
    categoryAr: "الطلب وطرق الدفع",
    questionFr: "Quels sont les modes de paiement acceptés ?",
    questionAr: "ما هي طرق الدفع المتاحة في المتجر ؟",
    answerFr:
      "Nous fonctionnons principalement avec le Paiement à la Livraison (Cash on Delivery). Vous ne payez en espèces qu'après réception et vérification physique de votre colis auprès du livreur.",
    answerAr:
      "نعتمد بشكل أساسي على الدفع نقداً عند الاستلام. لا تدفع أي مبلغ حتى تستلم طردك وتتحقق منه بنفسك عند باب منزلك."
  },
  {
    categoryFr: "Commandes & Paiement",
    categoryAr: "الطلب وطرق الدفع",
    questionFr: "Puis-je commander directement via WhatsApp ?",
    questionAr: "هل يمكنني الطلب مباشرة عبر تطبيق واتساب ؟",
    answerFr:
      "Oui absolument ! Chaque fiche produit dispose d'un bouton 'Commander directement via WhatsApp'. Il ouvre une discussion instantanée avec toutes les références de votre produit.",
    answerAr:
      "نعم بكل تأكيد ! تحتوي كل صفحة منتج على زر 'طلب مباشر عبر واتساب'. بالضغط عليه يتم فتح محادثة فورية مجهزة بكافة تفاصيل وسعر المنتج المطلوب."
  },
  {
    categoryFr: "Authenticité & Qualité",
    categoryAr: "الجودة والأصالة",
    questionFr: "Vos téléphones sont-ils 100% authentiques et certifiés ?",
    questionAr: "هل جميع هواتفكم أصلية ومضمونة 100% ؟",
    answerFr:
      "Oui, tous nos appareils proviennent de canaux de distribution officiels certifiés avec numéros IMEI d'origine et compatibilité totale avec tous les opérateurs marocains.",
    answerAr:
      "نعم بكل تأكيد. جميع أجهزتنا أصلية ومستوردة من موزعين معتمدين رسمياً مع أرقام IMEI أصلية وتوافق كامل مع جميع شبكات الاتصال في المغرب."
  },
  {
    categoryFr: "Authenticité & Qualité",
    categoryAr: "الجودة والأصالة",
    questionFr: "En quoi consiste le contrôle qualité Jabour Phone ?",
    questionAr: "ما هو الفحص الفني الذي تخضع له الأجهزة قبل الشحن ؟",
    answerFr:
      "Nos techniciens vérifient l'état de la batterie, la réactivité de l'écran, les caméras, les haut-parleurs et la connectivité réseau avant toute expédition.",
    answerAr:
      "يقوم خبراؤنا بفحص صحة البطارية، استجابة شاشة اللمس، عمل الكاميرات، نقاء الصوت وتوصيل الشبكة والواي فاي قبل تغليف وإرسال أي جهاز."
  },
  {
    categoryFr: "Livraison & Suivi",
    categoryAr: "الشحن والتوصيل",
    questionFr: "Combien de temps prend la livraison ?",
    questionAr: "كم تستغرق مدة توصيل الطلب إلى مدينتي ؟",
    answerFr:
      "Les commandes sont livrées sous 24h à Casablanca et Rabat, et sous 24h à 48h pour les autres villes du Royaume.",
    answerAr:
      "يتم التوصيل خلال 24 ساعة في الدار البيضاء والرباط، وخلال 24 إلى 48 ساعة لباقي المدن المغربية."
  },
  {
    categoryFr: "Garantie & SAV",
    categoryAr: "الضمان وما بعد البيع",
    questionFr: "Quelle est la garantie offerte sur vos appareils ?",
    questionAr: "ما هي مدة الضمان المعتمدة للأجهزة ؟",
    answerFr:
      "Chaque smartphone neuf bénéficie de notre garantie officielle de 1 an contre tout vice de fabrication matériel avec assistance directe.",
    answerAr:
      "كل هاتف ذكي جديد مشمول بضمان رسمي حقيقي لمدة عام كامل (12 شهراً) ضد أي عيب مصنعي أو عطل فني في العتاد."
  },
  {
    categoryFr: "Garantie & SAV",
    categoryAr: "الضمان وما بعد البيع",
    questionFr: "Quelle est votre politique d'échange ?",
    questionAr: "ما هي سياسة الاستبدال والإرجاع في حالة وجود عيب ؟",
    answerFr:
      "Nous proposons une politique d'échange sous 14 jours en cas de défaut matériel avéré. Le produit doit être retourné complet avec sa boîte et ses accessoires d'origine.",
    answerAr:
      "نوفر حق الاستبدال خلال 14 يوماً في حالة وجود أي عيب مصنعي مؤكد. يشترط إعادة الجهاز بملحقاته وعلبته الأصلية."
  }
];

export const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isAr = language === "ar";

  const allCatLabel = isAr ? "جميع الأسئلة" : "Toutes les catégories";
  const [selectedCategory, setSelectedCategory] = useState<string>(allCatLabel);

  const categories = [
    allCatLabel,
    ...Array.from(new Set(FAQ_DATA.map((item) => (isAr ? item.categoryAr : item.categoryFr))))
  ];

  const filtered =
    selectedCategory === allCatLabel
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => (isAr ? item.categoryAr === selectedCategory : item.categoryFr === selectedCategory));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title={t("pages.faq.title")}
        description={t("pages.faq.subtitle")}
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          {t("nav.faq")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          {t("pages.faq.title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          {t("pages.faq.subtitle")}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${selectedCategory === cat
                ? "bg-[#15161d] text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;
          const question = isAr ? item.questionAr : item.questionFr;
          const answer = isAr ? item.answerAr : item.answerFr;

          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-bold text-[#15161d]">{question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-[#d10024]" : ""
                    }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
        <HelpCircle className="w-8 h-8 text-[#d10024] mx-auto" />
        <h3 className="text-base font-bold text-[#15161d]">{t("pages.faq.needMoreHelp")}</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          {t("pages.contact.subtitle")}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#15161d] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> {t("nav.contact")}
          </Link>
          <a
            href={`https://wa.me/${(settings.whatsapp || "212661123456").replace(/[^\d]/g, "")}?text=${encodeURIComponent(
              isAr ? "مرحباً جبور فون، لدي استفسار." : "Bonjour Jabour Phone, j'ai une question."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" /> {t("pages.faq.whatsappCta")}
          </a>
        </div>
      </div>
    </div>
  );
};
