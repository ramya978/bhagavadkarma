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
  /**
   * og:description — social-share copy (WhatsApp / Facebook / LinkedIn).
   * Written for humans scrolling a feed: benefit-led and conversational,
   * ~100–160 chars. Falls back to `description` when omitted.
   */
  ogDescription?: string;
  /**
   * twitter:description — X/Twitter card copy. Shorter and punchier than the
   * OG text (~100–125 chars). Falls back to `ogDescription`, then `description`.
   */
  twitterDescription?: string;
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
  ogDescription:
    'Discover Bhagavad Karma — spiritual wellness programmes, Vedic wisdom and seva initiatives that uplift lives across India. Begin your inner journey with us.',
  twitterDescription:
    'Spiritual wellness, Vedic wisdom and seva for social good — explore the Bhagavad Karma mission.',
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
    ogDescription:
      'The story behind Bhagavad Karma — how one charitable trust unites spiritual awareness, education and social welfare into a single mission of service.',
    twitterDescription:
      'Meet Bhagavad Karma: a charitable trust blending spirituality, education and seva to uplift communities.',
    keywords: 'about bhagavad karma, charitable trust, spiritual organisation',
    intent: 'navigational',
    breadcrumb: 'Who We Are',
    section: 'About Us',
  },
  'our-guru': {
    title: 'Our Guru | Spiritual Master of Bhagavad Karma',
    description:
      'Meet the Guru of Bhagavad Karma — his spiritual journey, teachings and vision guiding a movement of wellness, seva and social upliftment across India.',
    ogDescription:
      'From southern India to a nationwide movement of seva — read the spiritual journey and teachings of the Guru who guides Bhagavad Karma.',
    twitterDescription:
      'The journey, teachings and vision of the spiritual master guiding Bhagavad Karma.',
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
    ogDescription:
      'Karma, dharma and mindful living — dive into timeless Vedic wisdom made practical for the modern seeker by Bhagavad Karma.',
    twitterDescription:
      'Timeless Vedic wisdom on karma, dharma and mindful living — curated for today’s seekers.',
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
    ogDescription:
      'Feeling overwhelmed? Bhagavad Karma’s emotional wellness sessions blend counselling, CBT and mindfulness to restore calm and resilience.',
    twitterDescription:
      'Counselling, mindfulness and stress relief that restore emotional balance.',
    keywords: 'emotional wellness, mindfulness, stress relief, counselling',
    intent: 'commercial',
    breadcrumb: 'Emotional Wellness',
    section: 'Services',
  },
  'physical-wellness': {
    title: 'Physical Wellness & Health Guidance | Bhagavad Karma',
    description:
      'Physical wellness guidance from Bhagavad Karma — holistic health consultations, lifestyle advice and natural practices for a stronger, healthier body.',
    ogDescription:
      'Rebuild strength the natural way — holistic health consultations, lifestyle guidance and sacred practices for a healthier body.',
    twitterDescription:
      'Holistic health consultations and natural practices for a stronger body.',
    keywords: 'physical wellness, holistic health, wellness guidance',
    intent: 'commercial',
    breadcrumb: 'Physical Wellness',
    section: 'Services',
  },
  'spiritual-wellness': {
    title: 'Spiritual Wellness & Sacred Rituals | Bhagavad Karma',
    description:
      'Spiritual wellness at Bhagavad Karma: aura assessment, sacred rituals and guided practices to deepen inner peace and reconnect with your higher self.',
    ogDescription:
      'Reconnect with your higher self — aura assessment, sacred rituals and guided spiritual practices at Bhagavad Karma.',
    twitterDescription:
      'Aura assessment, sacred rituals and guided practices for deep inner peace.',
    keywords: 'spiritual wellness, sacred rituals, aura, inner peace',
    intent: 'commercial',
    breadcrumb: 'Spiritual Wellness',
    section: 'Services',
  },
  'therapeutic-wellness': {
    title: 'Therapeutic Wellness & Energy Healing | Bhagavad Karma',
    description:
      'Therapeutic wellness from Bhagavad Karma — energy healing, crystal therapy and restorative practices that soothe body, mind and spirit naturally.',
    ogDescription:
      'Energy healing, crystal therapy, breathwork and Ayurveda — therapeutic care that soothes body, mind and spirit at Bhagavad Karma.',
    twitterDescription:
      'Energy healing, crystal therapy and breathwork that restore body, mind and spirit.',
    keywords: 'therapeutic wellness, energy healing, crystal therapy',
    intent: 'commercial',
    breadcrumb: 'Therapeutic Wellness',
    section: 'Services',
  },
  'aura-mechanism': {
    title: 'Aura Mechanism & Chakra Balancing | Bhagavad Karma',
    description:
      'Understand the Aura Mechanism at Bhagavad Karma — energy-field assessment and chakra balancing that realign your subtle body for wellbeing and clarity.',
    ogDescription:
      'What does your energy field say about you? Explore aura assessment and chakra balancing with Bhagavad Karma’s Aura Mechanism.',
    twitterDescription:
      'Aura assessment and chakra balancing to realign your subtle energy.',
    keywords: 'aura mechanism, chakra balancing, energy field',
    intent: 'informational',
    breadcrumb: 'Aura Mechanism',
    section: 'Services',
  },
  'mystic-kriya': {
    title: 'Mystic Kriya Meditation Practices | Bhagavad Karma',
    description:
      'Mystic Kriya at Bhagavad Karma — ancient kriya meditation techniques for inner transformation, heightened awareness and lasting spiritual growth.',
    ogDescription:
      'Awaken deeper awareness with Mystic Kriya — ancient kriya meditation techniques for inner transformation, taught at Bhagavad Karma.',
    twitterDescription:
      'Ancient kriya meditation for inner transformation and heightened awareness.',
    keywords: 'mystic kriya, kriya yoga, meditation practice',
    intent: 'informational',
    breadcrumb: 'Mystic Kriya',
    section: 'Services',
  },
  'little-diamonds': {
    title: 'Little Diamonds — Child Wellness | Bhagavad Karma',
    description:
      'Little Diamonds by Bhagavad Karma nurtures childhood wellness and youth empowerment through values, mindfulness and holistic development programmes.',
    ogDescription:
      'Every child shines. Little Diamonds nurtures young minds with values, mindfulness and holistic development — a Bhagavad Karma programme.',
    twitterDescription:
      'Values, mindfulness and holistic growth for children — the Little Diamonds programme.',
    keywords: 'little diamonds, child wellness, youth empowerment',
    intent: 'informational',
    breadcrumb: 'Little Diamonds',
    section: 'Services',
  },
  'inner-hush': {
    title: 'Inner Hush — Silence & Meditation | Bhagavad Karma',
    description:
      'Inner Hush at Bhagavad Karma guides you into deep silence and meditation, quieting the mind to reveal stillness, clarity and profound inner peace.',
    ogDescription:
      'Step into deep silence. Inner Hush guides you through meditation that quiets the mind and reveals lasting inner peace.',
    twitterDescription:
      'Guided silence and meditation that quiet the mind and reveal inner stillness.',
    keywords: 'inner hush, silence, meditation, inner peace',
    intent: 'informational',
    breadcrumb: 'Inner Hush',
    section: 'Services',
  },
  'yogic-elements': {
    title: 'Yogic Elements & Elemental Balance | Bhagavad Karma',
    description:
      'Yogic Elements at Bhagavad Karma harmonises the five elements through yoga practice, restoring elemental balance for vitality, focus and wellbeing.',
    ogDescription:
      'Earth, water, fire, air and space — balance all five elements through yoga with Bhagavad Karma’s Yogic Elements practice.',
    twitterDescription:
      'Harmonise the five elements through yoga for vitality, focus and wellbeing.',
    keywords: 'yogic elements, five elements, yoga practice',
    intent: 'informational',
    breadcrumb: 'Yogic Elements',
    section: 'Services',
  },
  'vedic-food': {
    title: 'Vedic Food & Sattvic Nutrition | Bhagavad Karma',
    description:
      'Vedic Food guidance from Bhagavad Karma — traditional sattvic nutrition and mindful eating that nourish the body and support a calm, sattvic mind.',
    ogDescription:
      'Food that calms the mind — learn sattvic cooking and mindful eating rooted in Vedic tradition with Bhagavad Karma.',
    twitterDescription:
      'Sattvic nutrition and mindful eating rooted in Vedic tradition.',
    keywords: 'vedic food, sattvic nutrition, ayurvedic diet',
    intent: 'informational',
    breadcrumb: 'Vedic Food',
    section: 'Services',
  },
  'maha-vashya': {
    title: 'Maha Vashya Shakthi Practices | Bhagavad Karma',
    description:
      'Discover Maha Vashya Shakthi at Bhagavad Karma — sacred practices rooted in spiritual discipline to cultivate positive influence, focus and harmony.',
    ogDescription:
      'Cultivate positive influence, focus and harmony through Maha Vashya Shakthi — sacred discipline taught at Bhagavad Karma.',
    twitterDescription:
      'Sacred practices for positive influence, focus and harmony — Maha Vashya Shakthi.',
    keywords: 'maha vashya shakthi, spiritual practice',
    intent: 'informational',
    breadcrumb: 'Maha Vashya Shakthi',
    section: 'Services',
  },

  // ── Act for Good ──────────────────────────────────────────────────────────
  'act-for-good': {
    title: 'Act for Good | Bhagavad Karma Seva Initiatives',
    description:
      'Act for Good with Bhagavad Karma — explore Annadanam seva, dharma protection and community action that turn compassion into everyday practice.',
    ogDescription:
      'Compassion turned into action — explore all the ways you can Act for Good with Bhagavad Karma’s seva initiatives.',
    twitterDescription:
      'Explore Bhagavad Karma’s Act for Good seva initiatives.',
    keywords: 'act for good, bhagavad karma seva, charitable initiatives',
    intent: 'informational',
    breadcrumb: 'Act for Good',
    section: 'Act for Good',
  },
  'feed-a-monk': {
    title: 'Feed a Monk — Annadanam Seva | Bhagavad Karma',
    description:
      'Feed a Monk with Bhagavad Karma: support Annadanam seva that offers sattvic meals to monks and sustains a life of monastic discipline and service.',
    ogDescription:
      'One meal sustains a life of prayer. Join Bhagavad Karma’s Annadanam seva and offer sattvic meals to monks devoted to dharma.',
    twitterDescription:
      'Offer a sattvic meal to a monk through Annadanam seva — every gift sustains dharma.',
    keywords: 'feed a monk, annadanam, seva, monk support',
    intent: 'transactional',
    breadcrumb: 'Feed a Monk',
    section: 'Act for Good',
  },
  'the-vision-in-action-of-bhagavad-karma': {
    title: 'The Vision in Action | Bhagavad Karma',
    description:
      'The Vision in Action of Bhagavad Karma — our mission and long-term goals to uplift society through spirituality, seva and sustainable social change.',
    ogDescription:
      'See our vision in action — how Bhagavad Karma turns spirituality and seva into lasting social change across communities.',
    twitterDescription:
      'How Bhagavad Karma turns spirituality and seva into lasting social change.',
    keywords: 'bhagavad karma vision, mission, social change',
    intent: 'informational',
    breadcrumb: 'The Vision in Action',
    section: 'Act for Good',
  },
  'support-for-dharma-samrakshana': {
    title: 'Support for Dharma Samrakshana | Bhagavad Karma',
    description:
      'Support for Dharma Samrakshana with Bhagavad Karma — help protect and preserve dharma, sacred traditions and spiritual heritage for generations.',
    ogDescription:
      'Help protect sacred traditions for the generations to come — stand with Bhagavad Karma’s Dharma Samrakshana mission.',
    twitterDescription:
      'Stand with the mission to protect dharma, sacred traditions and spiritual heritage.',
    keywords: 'dharma samrakshana, support dharma, preserve traditions',
    intent: 'transactional',
    breadcrumb: 'Support for Dharma Samrakshana',
    section: 'Act for Good',
  },
  'pancha-anga-karma-vruksham': {
    title: 'Pancha-Anga Karma Vruksham | Bhagavad Karma',
    description:
      'Pancha-Anga Karma Vruksham by Bhagavad Karma — the fivefold path of spiritual practice that roots daily life in dharma, seva and conscious action.',
    ogDescription:
      'Five limbs, one rooted life — explore Pancha-Anga Karma Vruksham, Bhagavad Karma’s fivefold path of dharma, seva and conscious action.',
    twitterDescription:
      'The fivefold path rooting daily life in dharma and seva — Pancha-Anga Karma Vruksham.',
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
    ogDescription:
      'Tree planting, conservation and sustainability drives — see how Bhagavad Karma protects nature and builds greener communities.',
    twitterDescription:
      'Tree planting and conservation drives building greener communities.',
    keywords: 'environment, sustainability, conservation, tree planting',
    intent: 'informational',
    breadcrumb: 'Environment',
    section: 'Social Impacts',
  },
  'farmer-support': {
    title: 'Farmer Support Initiatives | Bhagavad Karma',
    description:
      'Farmer support from Bhagavad Karma — empowering agricultural communities with resources, training and sustainable practices for stronger livelihoods.',
    ogDescription:
      'Standing with those who feed us — Bhagavad Karma empowers farmers with resources, training and sustainable practices.',
    twitterDescription:
      'Empowering farmers with training, resources and sustainable practices.',
    keywords: 'farmer support, agriculture, rural empowerment',
    intent: 'informational',
    breadcrumb: 'Farmer Support',
    section: 'Social Impacts',
  },
  livelihood: {
    title: 'Livelihood & Skill Development | Bhagavad Karma',
    description:
      'Livelihood programmes at Bhagavad Karma drive economic growth and skill development, helping communities build sustainable income and self-reliance.',
    ogDescription:
      'Skills that build self-reliance — Bhagavad Karma’s livelihood programmes help communities create sustainable incomes.',
    twitterDescription:
      'Skill development and livelihood programmes for self-reliant communities.',
    keywords: 'livelihood, skill development, economic empowerment',
    intent: 'informational',
    breadcrumb: 'Livelihood',
    section: 'Social Impacts',
  },
  'rural-healthcare': {
    title: 'Rural Healthcare Outreach | Bhagavad Karma',
    description:
      'Rural healthcare outreach by Bhagavad Karma brings medical camps, awareness and health access to underserved rural communities across the region.',
    ogDescription:
      'Healthcare should not depend on your postcode — Bhagavad Karma brings medical camps and health awareness to rural communities.',
    twitterDescription:
      'Medical camps and health outreach for underserved rural communities.',
    keywords: 'rural healthcare, medical camps, health outreach',
    intent: 'informational',
    breadcrumb: 'Rural Healthcare',
    section: 'Social Impacts',
  },
  'community-well-being': {
    title: 'Community Well-Being Initiatives | Bhagavad Karma',
    description:
      'Community well-being initiatives from Bhagavad Karma — collaborative programmes that build resilient, connected and thriving local communities.',
    ogDescription:
      'Stronger together — see how Bhagavad Karma’s community well-being initiatives build resilient, connected neighbourhoods.',
    twitterDescription:
      'Collaborative initiatives building resilient, connected communities.',
    keywords: 'community well-being, community initiatives, social impact',
    intent: 'informational',
    breadcrumb: 'Community Well-Being Initiatives',
    section: 'Social Impacts',
  },
  'social-support': {
    title: 'Community Social Support | Bhagavad Karma',
    description:
      'Community social support from Bhagavad Karma — compassionate outreach and relief that uplifts vulnerable families and strengthens local communities.',
    ogDescription:
      'Compassion in action — Bhagavad Karma’s outreach and relief uplift vulnerable families and strengthen local communities.',
    twitterDescription:
      'Outreach and relief that uplift vulnerable families and strengthen communities.',
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
    ogDescription:
      'Programmes, seva drives and community milestones — catch up on everything happening at Bhagavad Karma.',
    twitterDescription:
      'Latest news, events and updates from Bhagavad Karma.',
    keywords: 'bhagavad karma news, updates, events',
    intent: 'informational',
    breadcrumb: 'News',
  },
  contact: {
    title: 'Contact Bhagavad Karma | Bangalore, Karnataka',
    description:
      'Contact Bhagavad Karma in Bangalore, Karnataka. Call +91 89040 72335 or email help@bhagavadkarma.org to connect with our team and plan your visit.',
    ogDescription:
      'Questions, visits or collaborations — reach the Bhagavad Karma team in Bangalore by phone, email or in person.',
    twitterDescription:
      'Reach Bhagavad Karma in Bangalore — call +91 89040 72335 or email help@bhagavadkarma.org.',
    keywords: 'contact bhagavad karma, bangalore, phone, email',
    intent: 'transactional',
    breadcrumb: 'Contact',
  },
  appointment: {
    title: 'Book an Appointment | Bhagavad Karma',
    description:
      'Book an appointment with Bhagavad Karma to schedule a spiritual wellness session, consultation or guidance meeting at a time that suits you.',
    ogDescription:
      'Ready for guidance? Book a spiritual wellness session or consultation with Bhagavad Karma at a time that suits you.',
    twitterDescription:
      'Book your spiritual wellness session or consultation with Bhagavad Karma.',
    keywords: 'book appointment, wellness session, consultation',
    intent: 'transactional',
    breadcrumb: 'Book Appointment',
  },
  member: {
    title: 'Become a Member | Bhagavad Karma Community',
    description:
      'Become a member of the Bhagavad Karma community. Join our spiritual family to access programmes, events and a supportive path of seva and growth.',
    ogDescription:
      'Join a community walking the path together — become a Bhagavad Karma member and access programmes, events and seva.',
    twitterDescription:
      'Become a Bhagavad Karma member — programmes, events and a path of seva and growth.',
    keywords: 'become a member, spiritual community, membership',
    intent: 'transactional',
    breadcrumb: 'Become a Member',
  },
  donation: {
    title: 'Donate to Bhagavad Karma | Support Our Mission',
    description:
      'Donate to Bhagavad Karma and support spiritual education, seva and social welfare. Your contribution helps uplift communities across India.',
    ogDescription:
      'Your generosity powers education, seva and social welfare — donate to Bhagavad Karma and help uplift communities across India.',
    twitterDescription:
      'Support spiritual education and social welfare — donate to Bhagavad Karma.',
    keywords: 'donate, donation, support charity, seva',
    intent: 'transactional',
    breadcrumb: 'Donation',
  },
  sitemap: {
    title: 'Sitemap | Bhagavad Karma',
    description:
      'Browse the complete Bhagavad Karma sitemap — a clear overview of every page across our spiritual services, social initiatives and community resources.',
    ogDescription:
      'Find any page fast — the full map of Bhagavad Karma’s services, initiatives and resources.',
    twitterDescription:
      'The complete map of Bhagavad Karma’s pages, services and initiatives.',
    keywords: 'sitemap, site navigation',
    intent: 'navigational',
    breadcrumb: 'Sitemap',
  },

  // ── Store ─────────────────────────────────────────────────────────────────
  'store/skincare': {
    title: 'Herbal Skincare Store | Bhagavad Karma',
    description:
      'Shop herbal and natural skincare essentials from Bhagavad Karma — pure, wellness-focused products crafted to nourish and protect your skin.',
    ogDescription:
      'Purity you can feel — herbal, wellness-focused skincare crafted by Bhagavad Karma to nourish and protect your skin.',
    twitterDescription:
      'Herbal, natural skincare essentials from the Bhagavad Karma wellness store.',
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
    ogDescription:
      'Ingredients, benefits and pricing — everything you need to know before choosing your Bhagavad Karma wellness product.',
    twitterDescription:
      'Full details for Bhagavad Karma wellness and skincare products.',
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
    ogDescription:
      'Browse the full range of natural, herbal wellness products from Bhagavad Karma — crafted for everyday holistic wellbeing.',
    twitterDescription:
      'The complete collection of Bhagavad Karma herbal wellness and skincare products.',
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
