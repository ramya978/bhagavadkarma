import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SEO_ROUTES } from '../../services/seo-data';

/** One card on the sitemap. */
interface SitemapItem {
  link: string;
  title: string;
  desc: string;
  icon: string;
  iconClass: string;
  col: string;
}
/** A titled group of cards (About Us, Services, …). */
interface SitemapGroup {
  heading: string;
  groupIcon: string;
  items: SitemapItem[];
}
/** Display metadata for a route path (icon/description/column/section). */
interface PageMeta {
  title: string;
  desc: string;
  icon: string;
  iconClass: string;
  col: string;
  section: string;
  /** Concrete link when the route path is parameterised (e.g. store/:category). */
  link?: string;
}

const SECTION_ORDER = [
  'About Us', 'Services', 'Act for Good', 'Store', 'More',
];

const GROUP_ICONS: Record<string, string> = {
  'About Us': 'fa-circle-info',
  Services: 'fa-hand-holding-heart',
  'Act for Good': 'fa-hands-helping',
  Store: 'fa-store',
  More: 'fa-ellipsis-h',
};

const S3 = 'col-lg-3 col-md-6';
const S4 = 'col-lg-4 col-md-6';

/**
 * Display metadata keyed by the Router path. Declared in the intended visual
 * order — the sitemap renders known pages in THIS order, but only if the route
 * still exists in the Router (removed routes drop off automatically; new routes
 * not listed here are appended to "More"). This keeps the card design intact
 * while making the page reflect the live Router config.
 */
const PAGE_META: Record<string, PageMeta> = {
  // About Us
  'who-we-are': { title: 'Who We Are', desc: 'Our mission, values, and the story behind Bhagavad Karma', icon: 'fa-users', iconClass: '', col: 'col-lg-4', section: 'About Us' },
  'our-guru': { title: 'Our Guru', desc: 'Meet Swami Himaval Badrananda and his spiritual journey', icon: 'fa-user-tie', iconClass: '', col: 'col-lg-4', section: 'About Us' },
  wisdom: { title: 'Wisdom', desc: 'Ancient spiritual insights and timeless teachings', icon: 'fa-book-open', iconClass: '', col: 'col-lg-4', section: 'About Us' },

  // Services (matching navigation menu — only visible dropdown items)
  'aura-mechanism': { title: 'Aura Mechanism', desc: 'Energy field assessment & chakra balancing', icon: 'fa-circle-nodes', iconClass: 'aura-icon', col: S3, section: 'Services' },
  'mystic-kriya': { title: 'Mystic Kriya', desc: 'Ancient kriya practices for inner transformation', icon: 'fa-moon', iconClass: 'mystic-icon', col: S3, section: 'Services' },
  'little-diamonds': { title: 'Little Diamond', desc: 'Youth empowerment & childhood wellness', icon: 'fa-gem', iconClass: 'diamond-icon', col: S3, section: 'Services' },
  'inner-hush': { title: 'Inner Hush', desc: 'Silence & meditation for inner peace', icon: 'fa-volume-off', iconClass: 'hush-icon', col: S3, section: 'Services' },
  'yogic-elements': { title: 'Yogic Elements', desc: 'Yoga practice & elemental balance', icon: 'fa-yin-yang', iconClass: 'yogic-icon', col: S3, section: 'Services' },
  'vedic-food': { title: 'Vedic Food', desc: 'Traditional vedic nutrition & diet guidance', icon: 'fa-seedling', iconClass: 'food-icon', col: S3, section: 'Services' },
  'spiritual-wellness': { title: 'Spiritual Wellness', desc: 'Aura assessment & sacred rituals', icon: 'fa-spa', iconClass: 'spirit-icon', col: S3, section: 'Services' },

  // Act for Good
  'feed-a-monk': { title: 'Monk', desc: 'Monastic life & spiritual discipline', icon: 'fa-praying-hands', iconClass: 'monk-icon', col: S3, section: 'Act for Good' },
  'the-vision-in-action-of-bhagavad-karma': { title: 'Our Vision', desc: 'Our mission & long-term goals for society', icon: 'fa-eye', iconClass: 'vision-icon', col: S3, section: 'Act for Good' },
  'support-for-dharma-samrakshana': { title: 'Support', desc: 'How you can contribute & get involved', icon: 'fa-hand-holding-heart', iconClass: 'support-icon', col: S3, section: 'Act for Good' },
  'pancha-anga-karma-vruksham': { title: 'Pancha Anga', desc: 'The fivefold path of spiritual practice', icon: 'fa-om', iconClass: 'anga-icon', col: S3, section: 'Act for Good' },

  // Social Impacts (under Act for Good, matching the navigation menu)
  environment: { title: 'Environment', desc: 'Sustainability & conservation efforts', icon: 'fa-tree', iconClass: 'env-icon', col: S3, section: 'Act for Good' },
  'farmer-support': { title: 'Farmer Support', desc: 'Empowering agricultural communities', icon: 'fa-tractor', iconClass: 'farmer-icon', col: S3, section: 'Act for Good' },
  livelihood: { title: 'Livelihood', desc: 'Economic growth & skill development', icon: 'fa-briefcase', iconClass: 'liv-icon', col: S3, section: 'Act for Good' },
  'rural-healthcare': { title: 'Rural Healthcare', desc: 'Health access for rural communities', icon: 'fa-hospital', iconClass: 'health-icon', col: S3, section: 'Act for Good' },
  // 'social-support': { title: 'Social Support', desc: 'Community welfare & relief efforts', icon: 'fa-hand-holding-heart', iconClass: 'support-icon', col: S3, section: 'Act for Good' },
  'community-well-being': { title: 'Community Well-Being', desc: 'Community well-being initiatives & social harmony', icon: 'fa-people-arrows', iconClass: 'support-icon', col: S3, section: 'Act for Good' },

  // Store
  // 'store/:category': { title: 'Skincare', desc: 'Herbal & natural skincare essentials', icon: 'fa-hand-sparkles', iconClass: 'skin-icon', col: S4, section: 'Store', link: 'store/skincare' },
  // 'store-details': { title: 'Store Details', desc: 'Product information & shopping details', icon: 'fa-tag', iconClass: 'details-icon', col: S4, section: 'Store' },
  // allproducts: { title: 'All Products', desc: 'Browse our complete collection of wellness products', icon: 'fa-layer-group', iconClass: 'store-icon', col: S4, section: 'Store' },

  // More
  news: { title: 'News', desc: 'Latest updates & announcements', icon: 'fa-newspaper', iconClass: 'news-icon', col: S4, section: 'More' },
  contact: { title: 'Contact', desc: 'Get in touch with our team', icon: 'fa-envelope', iconClass: 'contact-icon', col: S4, section: 'More' },
  appointment: { title: 'Book Appointment', desc: 'Schedule your spiritual wellness session', icon: 'fa-calendar-check', iconClass: 'appoint-icon', col: S4, section: 'More' },
  member: { title: 'Become a Member', desc: 'Join our spiritual community', icon: 'fa-user-plus', iconClass: 'member-icon', col: S4, section: 'More' },
  donation: { title: 'Donation', desc: 'Support our charitable mission', icon: 'fa-hand-holding-usd', iconClass: 'donate-icon', col: S4, section: 'More' },
};

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sitemap.html',
  styleUrl: './sitemap.css',
})
export class SitemapComponent {
  private readonly router = inject(Router);

  /** Groups of cards, built from the live Router config (see PAGE_META note). */
  readonly groups: SitemapGroup[] = this.buildGroups();

  private buildGroups(): SitemapGroup[] {
    // Paths that actually exist in the Router (excluding redirect aliases).
    const routePaths = new Set(
      this.router.config
        .filter((r) => !(r as { redirectTo?: string }).redirectTo)
        .map((r) => r.path ?? '')
    );

    const bySection = new Map<string, SitemapItem[]>();
    const push = (section: string, item: SitemapItem) => {
      (bySection.get(section) ?? bySection.set(section, []).get(section)!).push(item);
    };

    // 1. Known pages, in declared order — only if the route still exists.
    for (const [path, meta] of Object.entries(PAGE_META)) {
      if (!routePaths.has(path)) continue;
      push(meta.section, {
        link: '/' + (meta.link ?? path),
        title: meta.title,
        desc: meta.desc,
        icon: meta.icon,
        iconClass: meta.iconClass,
        col: meta.col,
      });
    }

    // 2. Routes present in the Router but not yet described here → "More".
    // Routes to exclude from the sitemap entirely (hidden pages, commented-out nav items, etc.)
    const skip = new Set(['', 'home', 'sitemap', '**', 'emotional-wellness', 'physical-wellness', 'therapeutic-wellness', 'maha-vashya', 'social-support', 'store-details', 'allproducts', 'act-for-good']);
    for (const path of routePaths) {
      if (skip.has(path) || PAGE_META[path] || path.includes(':')) continue;
      const seo = SEO_ROUTES[path];
      push('More', {
        link: '/' + path,
        title: seo?.breadcrumb ?? path,
        desc: seo?.description ?? '',
        icon: 'fa-file-lines',
        iconClass: '',
        col: S4,
      });
    }

    // 3. Emit groups in the canonical section order.
    const groups: SitemapGroup[] = [];
    for (const section of SECTION_ORDER) {
      const items = bySection.get(section);
      if (items?.length) {
        groups.push({ heading: section, groupIcon: GROUP_ICONS[section] ?? 'fa-ellipsis-h', items });
      }
    }
    return groups;
  }
}
