import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { PRODUCTS } from '../../../Data/products.data';
import { Product } from '../../../Models/product.model';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-skincare',
  standalone: true,
  imports: [RouterLink],    
  templateUrl: './skincare.html',
  styleUrl: './skincare.css',
})
export class SkincareComponent implements OnInit {

  // ── INJECT ─────────────────────────────────────────────────
  private route        = inject(ActivatedRoute);
  cartService          = inject(CartService);

  // ── SIGNALS ────────────────────────────────────────────────
  pageTitle            = signal('Store');
  filteredProducts     = signal<Product[]>([]);
  cartDrawerOpen       = signal(false);
  toastVisible         = signal(false);
  toastMessage         = signal('');

  // map of product id -> qty for quick lookup in template
  cartQty = computed(() => {
    const m = new Map<number, number>();
    this.cartService.cart().forEach(i => m.set(i.id, i.qty));
    return m;
  });

  // ── CATEGORY CONFIG ────────────────────────────────────────
  private readonly CATEGORY_CONFIG: Record<string, { label: string; filter: string }> = {
    'skincare':          { label: 'Skincare',           filter: 'Skincare'          },
    'wellness-men':      { label: 'Wellness - Men',      filter: 'Wellness-Men'      },
    'wellness-women':    { label: 'Wellness - Women',    filter: 'Wellness-Women'    },
    'wellness-children': { label: 'Wellness - Children', filter: 'Wellness-Children' },
    'sacred-healing':    { label: 'Sacred Healing',      filter: 'Sacred'            },
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug   = params.get('category') || 'skincare';
      const config = this.CATEGORY_CONFIG[slug];

      this.pageTitle.set(config?.label || 'Store');

      const filter = config?.filter || 'All';
      this.filteredProducts.set(
        filter === 'All'
          ? [...PRODUCTS]
          : PRODUCTS.filter(p => p.category === filter)
      );
    });
  }
  
currentPage = signal(1);
itemsPerPage = 8;

totalPages = computed(() =>
  Math.ceil(this.filteredProducts().length / this.itemsPerPage)
);

paginatedProducts = computed(() => {
  const start = (this.currentPage() - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  return this.filteredProducts().slice(start, end);
});

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage.set(page);
  }
}

getPages(): number[] {
  return Array.from(
    { length: this.totalPages() },
    (_, i) => i + 1
  );
}
  // ── CART ───────────────────────────────────────────────────
  addToCart(product: Product) {
    this.cartService.add(product);
    this.showToast(product.name);
  }

  increaseQty(product: Product) {
    this.cartService.add(product, 1);
    this.showToast(product.name);
  }

  decreaseQty(id: number) {
    this.cartService.decrease(id);
  }

  openCartDrawer()  { this.cartDrawerOpen.set(true);  document.body.style.overflow = 'hidden'; }
  closeCartDrawer() { this.cartDrawerOpen.set(false); document.body.style.overflow = ''; }

  goToCheckout() {
    const success = this.cartService.checkout();
    if (!success) this.showToast('Your cart is empty!');
    else this.closeCartDrawer();
  }

  showToast(name: string) {
    this.toastMessage.set(name);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 2800);
  }
}