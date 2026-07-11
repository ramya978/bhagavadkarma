import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PRODUCTS } from '../../../Data/products.data';
import { Product } from '../../../Models/product.model';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProductsComponent {
  private router = inject(Router);
  cartService = inject(CartService);
  pageTitle = signal('All Products');
  toastVisible = signal(false);
  toastMessage = signal('');

  // map of product id -> qty
  cartQty = computed(() => {
    const m = new Map<number, number>();
    this.cartService.cart().forEach(i => m.set(i.id, i.qty));
    return m;
  });

  // Products
  readonly productsSignal = signal<Product[]>(PRODUCTS);

  // Filter & Sort States
  selectedMaxPrice = signal<number>(5000);
  selectedSort = signal<string>('default');
  selectedCategories = signal<string[]>([]);

  // Filtered + Sorted
  filteredProducts = computed(() => {
    let list = [...this.productsSignal()];

    const activeCats = this.selectedCategories();
    if (activeCats.length > 0) {
      list = list.filter((p) => activeCats.includes(p.category));
    }

    list = list.filter((p) => p.price <= this.selectedMaxPrice());

    const sortType = this.selectedSort();
    if (sortType === 'lowToHigh') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortType === 'highToLow') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  });

  // Pagination
  currentPage = signal(1);
  readonly itemsPerPage = 8;

  totalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.itemsPerPage)
  );

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts().slice(start, end);
  });

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // ── FILTER HANDLERS ─────────────────────────────────────────
  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSort.set(value);
    this.currentPage.set(1);
  }

  onPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.selectedMaxPrice.set(value);
    this.currentPage.set(1);
  }

  onCategoryChange(category: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentCats = this.selectedCategories();

    this.selectedCategories.set(
      isChecked
        ? [...currentCats, category]
        : currentCats.filter((c) => c !== category)
    );
    this.currentPage.set(1);
  }

  clearAllFilters() {
    this.selectedCategories.set([]);
    this.selectedSort.set('default');
    this.selectedMaxPrice.set(5000);
    this.currentPage.set(1);
  }

  // ── VIEW DETAILS ─────────────────────────────────────────────
  viewDetails(product: Product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/store-details']);
  }

  // ── TOAST ───────────────────────────────────────────────────
  showToast(name: string) {
    this.toastMessage.set(name);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 2800);
  }

  // ── CART ────────────────────────────────────────────────────
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
}
