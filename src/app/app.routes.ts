import { Routes } from '@angular/router';

/**
 * ────────────────────────────────────────────────────────────────────────────
 *  Route configuration — lazy-loaded (code-split) pages
 * ────────────────────────────────────────────────────────────────────────────
 *  Every page uses `loadComponent` so its code ships in a separate chunk that
 *  is fetched only when the route is visited. This keeps the INITIAL JavaScript
 *  bundle small (faster first load / better LCP + INP) instead of eagerly
 *  importing all ~30 pages up front.
 *
 *  Navigation still feels instant: app.config.ts enables PreloadAllModules, so
 *  the route chunks are quietly downloaded in the background after the first
 *  paint. Behaviour and UI are unchanged — this is a pure delivery optimization.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },

  // About Us
  { path: 'who-we-are', loadComponent: () => import('./pages/about_us/who-we-are/who-we-are').then(m => m.WhoWeAreComponent) },
  { path: 'our-guru', loadComponent: () => import('./pages/about_us/our-guru/our-guru').then(m => m.OurGuruComponent) },
  { path: 'wisdom', loadComponent: () => import('./pages/about_us/wisdom/wisdom').then(m => m.WisdomComponent) },

  // Services
  { path: 'aura-mechanism', loadComponent: () => import('./pages/services/aura-mechanism/aura-mechanism').then(m => m.AuraMechanismComponent) },
  { path: 'mystic-kriya', loadComponent: () => import('./pages/services/mystic/mystic').then(m => m.MysticComponent) },
  { path: 'little-diamonds', loadComponent: () => import('./pages/services/little-diamond/little-diamond').then(m => m.LittleDiamondComponent) },
  { path: 'inner-hush', loadComponent: () => import('./pages/services/inner-hush/inner-hush').then(m => m.InnerHushComponent) },
  { path: 'yogic-elements', loadComponent: () => import('./pages/services/yogic-elements/yogic-elements').then(m => m.YogicElementsComponent) },
  { path: 'vedic-food', loadComponent: () => import('./pages/services/vedic-food/vedic-food').then(m => m.VedicFoodComponent) },
  { path: 'maha-vashya', loadComponent: () => import('./pages/services/maha-vashya/maha-vashya').then(m => m.MahaVashyaComponent) },
  { path: 'emotional-wellness', loadComponent: () => import('./pages/services/emotional-wellness/emotional-wellness').then(m => m.EmotionalWellnessComponent) },
  { path: 'physical-wellness', loadComponent: () => import('./pages/services/physical-wellness/physical-wellness').then(m => m.PhysicalWellnessComponent) },
  { path: 'spiritual-wellness', loadComponent: () => import('./pages/services/spiritual-wellness/spiritual-wellness').then(m => m.SpiritualWellnessComponent) },
  { path: 'therapeutic-wellness', loadComponent: () => import('./pages/services/therapeutic-wellness/therapeutic-wellness').then(m => m.TherapeuticWellnessComponent) },

  // Act for Good  (clean, keyword-rich URLs)
  { path: 'act-for-good', loadComponent: () => import('./pages/act-for-good/monk/monk').then(m => m.MonkComponent) },
  { path: 'feed-a-monk', loadComponent: () => import('./pages/act-for-good/monk/monk').then(m => m.MonkComponent) },
  { path: 'the-vision-in-action-of-bhagavad-karma', loadComponent: () => import('./pages/act-for-good/vision/vision').then(m => m.VisionComponent) },
  { path: 'support-for-dharma-samrakshana', loadComponent: () => import('./pages/act-for-good/support/support').then(m => m.SupportComponent) },
  { path: 'pancha-anga-karma-vruksham', loadComponent: () => import('./pages/act-for-good/pancha-anga/pancha-anga').then(m => m.PanchaAngaComponent) },

  // Social Impacts
  { path: 'environment', loadComponent: () => import('./pages/social_impacts/environment/environment').then(m => m.EnvironmentComponent) },
  { path: 'farmer-support', loadComponent: () => import('./pages/social_impacts/farmer-support/farmer-support').then(m => m.FarmerSupportComponent) },
  { path: 'livelihood', loadComponent: () => import('./pages/social_impacts/livelihood/livelihood').then(m => m.LivelihoodComponent) },
  { path: 'rural-healthcare', loadComponent: () => import('./pages/social_impacts/rural-healthcare/rural-healthcare').then(m => m.RuralHealthcareComponent) },
  { path: 'social-support', loadComponent: () => import('./pages/social_impacts/support/support').then(m => m.Support) },
  { path: 'community-well-being', loadComponent: () => import('./pages/social_impacts/community-well-being/community-well-being').then(m => m.CommunityWellBeingComponent) },

  // Utility / conversion
  { path: 'news', loadComponent: () => import('./pages/news/news').then(m => m.NewsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.ContactComponent) },
  { path: 'appointment', loadComponent: () => import('./pages/appontment/appontment').then(m => m.AppontmentComponent) },
  { path: 'member', loadComponent: () => import('./pages/member/member').then(m => m.MemberComponent) },
  { path: 'donation', loadComponent: () => import('./pages/donation/donation').then(m => m.DonationComponent) },
  { path: 'sitemap', loadComponent: () => import('./pages/sitemap/sitemap').then(m => m.SitemapComponent) },

  // Store
  { path: 'store/:category', loadComponent: () => import('./pages/stores/skincare/skincare').then(m => m.SkincareComponent) },
  { path: 'store-details', loadComponent: () => import('./pages/stores/store-details/store-details').then(m => m.StoreDetailsComponent) },
  { path: 'allproducts', loadComponent: () => import('./pages/stores/all-products/all-products').then(m => m.AllProductsComponent) },

  // ── Backward-compatible redirects: old URL → new SEO-friendly URL ──────────
  // Keeps existing/shared/bookmarked links and indexed pages working. For true
  // 301s (SEO link-equity transfer), also add server-level 301 rules — see the
  // "Hosting / Infrastructure" section of the technical documentation.
  { path: 'monk', redirectTo: 'feed-a-monk', pathMatch: 'full' },
  { path: 'vision', redirectTo: 'the-vision-in-action-of-bhagavad-karma', pathMatch: 'full' },
  { path: 'support', redirectTo: 'support-for-dharma-samrakshana', pathMatch: 'full' },
  { path: 'pacha-anga', redirectTo: 'pancha-anga-karma-vruksham', pathMatch: 'full' },
];
