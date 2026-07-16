/**
 * ────────────────────────────────────────────────────────────────────────────
 *  CENTRAL SEO CONFIGURATION  (single source of truth)
 * ────────────────────────────────────────────────────────────────────────────
 *  Every public route maps to a unique, intent-matched Title + Meta description,
 *  canonical URL, Open Graph / Twitter card data and JSON-LD schema type.
 *
 *  This file is consumed by:
 *    1. SeoService          → sets tags dynamically per route (client render)
 *    2. scripts/generate-sitemap.mjs (via app.routes.ts) → sitemap.xml
 *
 *  IMPORTANT: This is additive SEO metadata only. It renders NOTHING visible on
 *  screen and never touches component templates or CSS — the existing UI is
 *  fully preserved.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Canonical production origin — HTTPS, non-www (single canonical host). */
export const SITE_URL = 'https://bhagavadkarma.org';

/** Brand / entity constants — kept identical everywhere (NAP consistency). */
export const SITE = {
  name: 'Bhagavad Karma',
  legalName: 'Bhagavad Karma Charitable Organisation',
  url: SITE_URL,
  logo: `${SITE_URL}/assets/images/logo/bhagavad-karma-logo.svg`,
  /** 1200×630 social share image — replace with a dedicated OG banner when ready. */
  defaultOgImage: `${SITE_URL}/assets/images/logo/bhagavad-karma-logo.svg`,
  locale: 'en_IN',
  /** Brand X/Twitter handle for twitter:site / twitter:creator — replace with
   *  the real, verified handle (or set to '' to omit the tags). */
  twitterHandle: '@bhagavadkarma',
  telephone: '+91-89040-72335',
  email: 'help@bhagavadkarma.org',
  address: {
    street: 'No 6 CKMR Gardens, New Airport Road',
    locality: 'Bangalore',
    region: 'Karnataka',
    postalCode: '560077',
    country: 'IN',
  },
  /** Fill these with real, verified profile URLs to strengthen the entity. */
  sameAs: [
    // 'https://www.facebook.com/bhagavadkarma',
    // 'https://www.instagram.com/bhagavadkarma',
    // 'https://www.youtube.com/@bhagavadkarma',
    // 'https://www.linkedin.com/company/bhagavadkarma',
  ] as string[],
} as const;

/** Search intent classification (guides copy + internal-link strategy). */
export type SearchIntent =
  | 'informational'
  | 'navigational'
  | 'commercial'
  | 'transactional';

export interface SeoEntry {
  /** <title> — lead with primary keyword, unique, ~50–60 chars. */
  title: string;
  /** <meta name="description"> — compelling, ~150–160 chars, secondary keyword. */
  description: string;
  /** Primary + secondary keywords (used for internal mapping, NOT a meta tag). */
  keywords?: string;
  /** Search intent of the page's primary keyword. */
  intent?: SearchIntent;
  /** Optional page-specific OG/Twitter image (absolute or /assets path). */
  ogImage?: string;
  /** og:type — 'website' | 'article' | 'product'. Defaults to 'website'. */
  ogType?: 'website' | 'article' | 'product';
  /** Human-readable breadcrumb label (for BreadcrumbList schema). */
  breadcrumb?: string;
  /** Parent section label for the breadcrumb trail (e.g. "Services"). */
  section?: string;
  /** Q&A pairs for FAQPage JSON-LD (must mirror the visible on-page FAQ). */
  faq?: { question: string; answer: string }[];
}

/** Fallback used for any route not explicitly listed. */
export const SEO_DEFAULT: SeoEntry = {
  title: 'Bhagavad Karma | Spiritual Wellness & Charitable Trust',
  description:
    'Bhagavad Karma is a charitable organisation promoting spiritual awareness, wellness, education and social welfare to uplift mankind across India.',
  intent: 'navigational',
  ogType: 'website',
};

/**
 * Route path (WITHOUT leading slash) → SEO metadata.
 * Keys must match the paths declared in app.routes.ts.
 */
/**
 * Home entry — same title/description as the default, plus the FAQ that mirrors
 * the visible Q&A accordion on the home page (emitted as FAQPage JSON-LD).
 * Keep these answers in sync with home.html.
 */
const HOME: SeoEntry = {
  ...SEO_DEFAULT,
  faq: [
    {
      question: 'What is Bhagavad Karma Charitable Organisation?',
      answer:
        'Bhagavad Karma Charitable Organisation was established to promote spiritual awareness, education, safety, and social welfare, while supporting and uplifting mankind through holistic wellness services.',
    },
    {
      question: 'What types of wellness services do you offer?',
      answer:
        'We offer Emotional Wellness (counselling, CBT, mindfulness), Physical Wellness (health consultation, sacred rituals), Spiritual Wellness (aura testing, mystic practices), and Therapeutic Wellness (energy healing, crystal therapy, breathwork, Ayurveda).',
    },
    {
      question: 'Who is Swami Himaval Badrananda?',
      answer:
        'Swami Bhadraanand is a revered spiritual leader dedicated to preserving and promoting the timeless values of Sanatana Dharma. Born in southern India, he carries forward a legacy of wisdom, social responsibility, and spiritual enlightenment.',
    },
    {
      question: 'How can I book an appointment?',
      answer:
        'You can book an appointment through our online booking page. Simply fill in your name, email, phone, address, message, and preferred date and time, and we will confirm your session.',
    },
    {
      question: 'How does Bhagavad Karma support social causes?',
      answer:
        'We work across four key areas — Environment, Livelihood, Farmer Support, and Rural Healthcare — through collaborative and community-driven initiatives that build resilient ecosystems and improve quality of life.',
    },
  ],
};

export const SEO_ROUTES: Record<string, SeoEntry> = {
  '': HOME,
  home: HOME,

  // ── About Us ──────────────────────────────────────────────────────────────
  'who-we-are': {
    title: 'Who We Are | About Bhagavad Karma Charitable Trust',
    description:
      'Learn who we are: the mission, values and story behind Bhagavad Karma, a charitable trust promoting spiritual awareness and social welfare in India.',
    keywords: 'about bhagavad karma, charitable trust, spiritual organisation',
    intent: 'navigational',
    breadcrumb: 'Who We Are',
    section: 'About Us',
  },
  'our-guru': {
    title: 'Our Guru | Spiritual Master of Bhagavad Karma',
    description:
      'Meet the Guru of Bhagavad Karma — his spiritual journey, teachings and vision guiding a movement of wellness, seva and social upliftment across India.',
    keywords: 'bhagavad karma guru, spiritual master, spiritual guide',
    intent: 'informational',
    ogType: 'article',
    breadcrumb: 'Our Guru',
    section: 'About Us',
  },
  wisdom: {
    title: 'Vedic Wisdom & Spiritual Teachings | Bhagavad Karma',
    description:
      'Explore timeless Vedic wisdom and spiritual teachings from Bhagavad Karma — ancient insights on karma, dharma and mindful living for modern seekers.',
    keywords: 'vedic wisdom, spiritual teachings, karma, dharma',
    intent: 'informational',
    ogType: 'article',
    breadcrumb: 'Wisdom',
    section: 'About Us',
  },

  // ── Services ──────────────────────────────────────────────────────────────
  'emotional-wellness': {
    title: 'Emotional Wellness & Mindfulness | Bhagavad Karma',
    description:
      'Emotional wellness at Bhagavad Karma: counselling, mindfulness and stress-relief practices to restore inner balance, calm and emotional resilience.',
    keywords: 'emotional wellness, mindfulness, stress relief, counselling',
    intent: 'commercial',
    breadcrumb: 'Emotional Wellness',
    section: 'Services',
  },
  'physical-wellness': {
    title: 'Physical Wellness & Health Guidance | Bhagavad Karma',
    description:
      'Physical wellness guidance from Bhagavad Karma — holistic health consultations, lifestyle advice and natural practices for a stronger, healthier body.',
    keywords: 'physical wellness, holistic health, wellness guidance',
    intent: 'commercial',
    breadcrumb: 'Physical Wellness',
    section: 'Services',
  },
  'spiritual-wellness': {
    title: 'Spiritual Wellness & Sacred Rituals | Bhagavad Karma',
    description:
      'Spiritual wellness at Bhagavad Karma: aura assessment, sacred rituals and guided practices to deepen inner peace and reconnect with your higher self.',
    keywords: 'spiritual wellness, sacred rituals, aura, inner peace',
    intent: 'commercial',
    breadcrumb: 'Spiritual Wellness',
    section: 'Services',
  },
  'therapeutic-wellness': {
    title: 'Therapeutic Wellness & Energy Healing | Bhagavad Karma',
    description:
      'Therapeutic wellness from Bhagavad Karma — energy healing, crystal therapy and restorative practices that soothe body, mind and spirit naturally.',
    keywords: 'therapeutic wellness, energy healing, crystal therapy',
    intent: 'commercial',
    breadcrumb: 'Therapeutic Wellness',
    section: 'Services',
  },
  'aura-mechanism': {
    title: 'Aura Mechanism & Chakra Balancing | Bhagavad Karma',
    description:
      'Understand the Aura Mechanism at Bhagavad Karma — energy-field assessment and chakra balancing that realign your subtle body for wellbeing and clarity.',
    keywords: 'aura mechanism, chakra balancing, energy field',
    intent: 'informational',
    breadcrumb: 'Aura Mechanism',
    section: 'Services',
  },
  'mystic-kriya': {
    title: 'Mystic Kriya Meditation Practices | Bhagavad Karma',
    description:
      'Mystic Kriya at Bhagavad Karma — ancient kriya meditation techniques for inner transformation, heightened awareness and lasting spiritual growth.',
    keywords: 'mystic kriya, kriya yoga, meditation practice',
    intent: 'informational',
    breadcrumb: 'Mystic Kriya',
    section: 'Services',
  },
  'little-diamonds': {
    title: 'Little Diamonds — Child Wellness | Bhagavad Karma',
    description:
      'Little Diamonds by Bhagavad Karma nurtures childhood wellness and youth empowerment through values, mindfulness and holistic development programmes.',
    keywords: 'little diamonds, child wellness, youth empowerment',
    intent: 'informational',
    breadcrumb: 'Little Diamonds',
    section: 'Services',
  },
  'inner-hush': {
    title: 'Inner Hush — Silence & Meditation | Bhagavad Karma',
    description:
      'Inner Hush at Bhagavad Karma guides you into deep silence and meditation, quieting the mind to reveal stillness, clarity and profound inner peace.',
    keywords: 'inner hush, silence, meditation, inner peace',
    intent: 'informational',
    breadcrumb: 'Inner Hush',
    section: 'Services',
  },
  'yogic-elements': {
    title: 'Yogic Elements & Elemental Balance | Bhagavad Karma',
    description:
      'Yogic Elements at Bhagavad Karma harmonises the five elements through yoga practice, restoring elemental balance for vitality, focus and wellbeing.',
    keywords: 'yogic elements, five elements, yoga practice',
    intent: 'informational',
    breadcrumb: 'Yogic Elements',
    section: 'Services',
  },
  'vedic-food': {
    title: 'Vedic Food & Sattvic Nutrition | Bhagavad Karma',
    description:
      'Vedic Food guidance from Bhagavad Karma — traditional sattvic nutrition and mindful eating that nourish the body and support a calm, sattvic mind.',
    keywords: 'vedic food, sattvic nutrition, ayurvedic diet',
    intent: 'informational',
    breadcrumb: 'Vedic Food',
    section: 'Services',
  },
  'maha-vashya': {
    title: 'Maha Vashya Shakthi Practices | Bhagavad Karma',
    description:
      'Discover Maha Vashya Shakthi at Bhagavad Karma — sacred practices rooted in spiritual discipline to cultivate positive influence, focus and harmony.',
    keywords: 'maha vashya shakthi, spiritual practice',
    intent: 'informational',
    breadcrumb: 'Maha Vashya Shakthi',
    section: 'Services',
  },

  // ── Act for Good ──────────────────────────────────────────────────────────
  'feed-a-monk': {
    title: 'Feed a Monk — Annadanam Seva | Bhagavad Karma',
    description:
      'Feed a Monk with Bhagavad Karma: support Annadanam seva that offers sattvic meals to monks and sustains a life of monastic discipline and service.',
    keywords: 'feed a monk, annadanam, seva, monk support',
    intent: 'transactional',
    breadcrumb: 'Feed a Monk',
    section: 'Act for Good',
  },
  'the-vision-in-action-of-bhagavad-karma': {
    title: 'The Vision in Action | Bhagavad Karma',
    description:
      'The Vision in Action of Bhagavad Karma — our mission and long-term goals to uplift society through spirituality, seva and sustainable social change.',
    keywords: 'bhagavad karma vision, mission, social change',
    intent: 'informational',
    breadcrumb: 'The Vision in Action',
    section: 'Act for Good',
  },
  'support-for-dharma-samrakshana': {
    title: 'Support for Dharma Samrakshana | Bhagavad Karma',
    description:
      'Support for Dharma Samrakshana with Bhagavad Karma — help protect and preserve dharma, sacred traditions and spiritual heritage for generations.',
    keywords: 'dharma samrakshana, support dharma, preserve traditions',
    intent: 'transactional',
    breadcrumb: 'Support for Dharma Samrakshana',
    section: 'Act for Good',
  },
  'pancha-anga-karma-vruksham': {
    title: 'Pancha-Anga Karma Vruksham | Bhagavad Karma',
    description:
      'Pancha-Anga Karma Vruksham by Bhagavad Karma — the fivefold path of spiritual practice that roots daily life in dharma, seva and conscious action.',
    keywords: 'pancha anga, karma vruksham, fivefold path',
    intent: 'informational',
    breadcrumb: 'Pancha-Anga Karma Vruksham',
    section: 'Act for Good',
  },

  // ── Social Impacts ────────────────────────────────────────────────────────
  environment: {
    title: 'Environment & Sustainability | Bhagavad Karma',
    description:
      'Environment initiatives at Bhagavad Karma — tree planting, conservation and sustainability drives that protect nature and build greener communities.',
    keywords: 'environment, sustainability, conservation, tree planting',
    intent: 'informational',
    breadcrumb: 'Environment',
    section: 'Social Impacts',
  },
  'farmer-support': {
    title: 'Farmer Support Initiatives | Bhagavad Karma',
    description:
      'Farmer support from Bhagavad Karma — empowering agricultural communities with resources, training and sustainable practices for stronger livelihoods.',
    keywords: 'farmer support, agriculture, rural empowerment',
    intent: 'informational',
    breadcrumb: 'Farmer Support',
    section: 'Social Impacts',
  },
  livelihood: {
    title: 'Livelihood & Skill Development | Bhagavad Karma',
    description:
      'Livelihood programmes at Bhagavad Karma drive economic growth and skill development, helping communities build sustainable income and self-reliance.',
    keywords: 'livelihood, skill development, economic empowerment',
    intent: 'informational',
    breadcrumb: 'Livelihood',
    section: 'Social Impacts',
  },
  'rural-healthcare': {
    title: 'Rural Healthcare Outreach | Bhagavad Karma',
    description:
      'Rural healthcare outreach by Bhagavad Karma brings medical camps, awareness and health access to underserved rural communities across the region.',
    keywords: 'rural healthcare, medical camps, health outreach',
    intent: 'informational',
    breadcrumb: 'Rural Healthcare',
    section: 'Social Impacts',
  },
  'social-support': {
    title: 'Community Social Support | Bhagavad Karma',
    description:
      'Community social support from Bhagavad Karma — compassionate outreach and relief that uplifts vulnerable families and strengthens local communities.',
    keywords: 'social support, community welfare, relief',
    intent: 'informational',
    breadcrumb: 'Social Support',
    section: 'Social Impacts',
  },

  // ── Utility / Conversion ─────────────────────────────────────────────────
  news: {
    title: 'News & Updates | Bhagavad Karma',
    description:
      'Read the latest news, events and announcements from Bhagavad Karma — updates on our spiritual programmes, seva drives and community initiatives.',
    keywords: 'bhagavad karma news, updates, events',
    intent: 'informational',
    breadcrumb: 'News',
  },
  contact: {
    title: 'Contact Bhagavad Karma | Bangalore, Karnataka',
    description:
      'Contact Bhagavad Karma in Bangalore, Karnataka. Call +91 89040 72335 or email help@bhagavadkarma.org to connect with our team and plan your visit.',
    keywords: 'contact bhagavad karma, bangalore, phone, email',
    intent: 'transactional',
    breadcrumb: 'Contact',
  },
  appointment: {
    title: 'Book an Appointment | Bhagavad Karma',
    description:
      'Book an appointment with Bhagavad Karma to schedule a spiritual wellness session, consultation or guidance meeting at a time that suits you.',
    keywords: 'book appointment, wellness session, consultation',
    intent: 'transactional',
    breadcrumb: 'Book Appointment',
  },
  member: {
    title: 'Become a Member | Bhagavad Karma Community',
    description:
      'Become a member of the Bhagavad Karma community. Join our spiritual family to access programmes, events and a supportive path of seva and growth.',
    keywords: 'become a member, spiritual community, membership',
    intent: 'transactional',
    breadcrumb: 'Become a Member',
  },
  donation: {
    title: 'Donate to Bhagavad Karma | Support Our Mission',
    description:
      'Donate to Bhagavad Karma and support spiritual education, seva and social welfare. Your contribution helps uplift communities across India.',
    keywords: 'donate, donation, support charity, seva',
    intent: 'transactional',
    breadcrumb: 'Donation',
  },
  sitemap: {
    title: 'Sitemap | Bhagavad Karma',
    description:
      'Browse the complete Bhagavad Karma sitemap — a clear overview of every page across our spiritual services, social initiatives and community resources.',
    keywords: 'sitemap, site navigation',
    intent: 'navigational',
    breadcrumb: 'Sitemap',
  },

  // ── Store ─────────────────────────────────────────────────────────────────
  'store/skincare': {
    title: 'Herbal Skincare Store | Bhagavad Karma',
    description:
      'Shop herbal and natural skincare essentials from Bhagavad Karma — pure, wellness-focused products crafted to nourish and protect your skin.',
    keywords: 'herbal skincare, natural skincare, wellness products',
    intent: 'transactional',
    ogType: 'product',
    breadcrumb: 'Skincare',
    section: 'Store',
  },
  'store-details': {
    title: 'Product Details | Bhagavad Karma Store',
    description:
      'View detailed product information, ingredients and pricing for Bhagavad Karma wellness and skincare products before you buy with confidence.',
    keywords: 'product details, wellness products, skincare',
    intent: 'transactional',
    ogType: 'product',
    breadcrumb: 'Product Details',
    section: 'Store',
  },
  allproducts: {
    title: 'All Wellness Products | Bhagavad Karma Store',
    description:
      'Browse the complete collection of Bhagavad Karma wellness and skincare products — natural, herbal essentials for holistic everyday wellbeing.',
    keywords: 'all products, wellness store, herbal products',
    intent: 'commercial',
    ogType: 'product',
    breadcrumb: 'All Products',
    section: 'Store',
  },
};

/**
 * Resolve an SeoEntry for a given router URL.
 * Strips query/fragment, normalises the leading slash and falls back to the
 * default entry when a specific match is not found (e.g. dynamic :category).
 */
export function resolveSeo(url: string): SeoEntry {
  const clean = (url.split('?')[0].split('#')[0] || '/').replace(/^\/+/, '');
  if (clean === '') return SEO_ROUTES[''];
  if (SEO_ROUTES[clean]) return SEO_ROUTES[clean];

  // Dynamic store category → reuse the skincare store entry as a sensible base.
  if (clean.startsWith('store/')) return SEO_ROUTES['store/skincare'];

  return SEO_DEFAULT;
}
