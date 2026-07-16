/**
 * ────────────────────────────────────────────────────────────────────────────
 *  SeoService  —  dynamic per-route SEO for the Bhagavad Karma SPA
 * ────────────────────────────────────────────────────────────────────────────
 *  Angular renders one index.html and swaps components on navigation, so a
 *  single static <title>/description would apply to every URL. This service
 *  listens for route changes and rewrites, per page:
 *
 *    • <title> and <meta name="description">
 *    • <link rel="canonical">                    (duplicate-URL consolidation)
 *    • <meta name="robots">                       (index/follow)
 *    • Open Graph tags (og:*)                     (WhatsApp / Facebook / LinkedIn)
 *    • Twitter Card tags (twitter:*)              (X/Twitter previews)
 *    • JSON-LD  WebPage + BreadcrumbList          (rich results + AI citation)
 *
 *  It is 100% additive: it writes only to <head> and renders nothing visible,
 *  so the existing theme UI is untouched. Uses Angular's built-in Title/Meta
 *  services plus the DOCUMENT token — no third-party library required.
 * ────────────────────────────────────────────────────────────────────────────
 */
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SITE, resolveSeo, type SeoEntry } from './seo-data';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  /** Subscribe once to route changes and refresh all head tags per page. */
  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.apply(e.urlAfterRedirects));
  }

  /** Resolve metadata for the URL and write every head tag. */
  private apply(url: string): void {
    const entry = resolveSeo(url);
    const canonical = this.canonicalUrl(url);
    const image = this.absolute(entry.ogImage ?? SITE.defaultOgImage);

    // ── Title + description ────────────────────────────────────────────────
    this.title.setTitle(entry.title);
    this.setName('description', entry.description);
    this.setName('robots', 'index, follow, max-image-preview:large');

    // ── Canonical ──────────────────────────────────────────────────────────
    this.setCanonical(canonical);

    // ── Open Graph ─────────────────────────────────────────────────────────
    this.setProp('og:title', entry.title);
    this.setProp('og:description', entry.description);
    this.setProp('og:url', canonical);
    this.setProp('og:type', entry.ogType ?? 'website');
    this.setProp('og:image', image);
    this.setProp('og:site_name', SITE.name);
    this.setProp('og:locale', SITE.locale);

    // ── Twitter Card ───────────────────────────────────────────────────────
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', entry.title);
    this.setName('twitter:description', entry.description);
    this.setName('twitter:image', image);
    if (SITE.twitterHandle) {
      this.setName('twitter:site', SITE.twitterHandle);
      this.setName('twitter:creator', SITE.twitterHandle);
    }

    // ── Structured data ────────────────────────────────────────────────────
    this.setJsonLd(this.buildGraph(entry, canonical, image));
  }

  // ── head helpers ──────────────────────────────────────────────────────────

  private setName(name: string, content: string): void {
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private setProp(property: string, content: string): void {
    if (this.meta.getTag(`property="${property}"`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  private setCanonical(href: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  /** Replace the per-page JSON-LD block (identified by a data attribute). */
  private setJsonLd(graph: unknown): void {
    const id = 'seo-jsonld';
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(graph);
  }

  // ── builders ────────────────────────────────────────────────────────────

  /** WebPage + BreadcrumbList graph for the current page. */
  private buildGraph(entry: SeoEntry, canonical: string, image: string): object {
    const graph: object[] = [
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: entry.title,
        description: entry.description,
        inLanguage: 'en-IN',
        primaryImageOfPage: image,
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': `${SITE.url}/#organization` },
      },
      this.breadcrumb(entry, canonical),
    ];

    // FAQPage — only when the page has a real, visible Q&A section (e.g. home).
    if (entry.faq?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: entry.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  /** Home → single crumb; interior pages → Home ▸ [Section ▸] Page. */
  private breadcrumb(entry: SeoEntry, canonical: string): object {
    const items: object[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
    ];
    let pos = 2;
    if (entry.section) {
      items.push({ '@type': 'ListItem', position: pos++, name: entry.section });
    }
    if (entry.breadcrumb) {
      items.push({
        '@type': 'ListItem',
        position: pos,
        name: entry.breadcrumb,
        item: canonical,
      });
    }
    return { '@type': 'BreadcrumbList', itemListElement: items };
  }

  // ── url helpers ───────────────────────────────────────────────────────────

  /** Build an absolute, trailing-slash-free canonical URL. */
  private canonicalUrl(url: string): string {
    const path = (url.split('?')[0].split('#')[0] || '/').replace(/\/+$/, '');
    if (path === '' || path === '/') return `${SITE.url}/`;
    return `${SITE.url}${path.startsWith('/') ? path : '/' + path}`;
  }

  /** Turn a relative /assets path into an absolute URL for social tags. */
  private absolute(src: string): string {
    if (/^https?:\/\//i.test(src)) return src;
    return `${SITE.url}${src.startsWith('/') ? src : '/' + src}`;
  }
}
