import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, Product } from '../Models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  // ── STATE ──────────────────────────────────────────────────
  private readonly CART_KEY = 'bkCart';
  cart = signal<CartItem[]>(this.loadFromStorage());

  // ── COMPUTED ───────────────────────────────────────────────
  totalQty = computed(() => this.cart().reduce((s, x) => s + x.qty, 0));
  totalAmt = computed(() => this.cart().reduce((s, x) => s + x.price * x.qty, 0));

  // ✅ FIX: cartCount is now an alias for totalQty (computed, not manual signal)
  // This ensures header cart icon updates automatically whenever cart changes
  cartCount = this.totalQty;

  readonly totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  constructor(private router: Router) {}

  // ── LOAD / SAVE ────────────────────────────────────────────
  private loadFromStorage(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]') as CartItem[];
    } catch (err) {
      console.warn('CartService: failed to parse stored cart, resetting.', err);
      localStorage.removeItem(this.CART_KEY);
      return [];
    }
  }

  private persist() {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.cart()));
    } catch (err) {
      console.error('CartService: failed to persist cart to localStorage', err);
    }
  }

  // ── ADD ────────────────────────────────────────────────────
  add(product: Product, qty: number = 1) {
    if (!product || typeof product.id === 'undefined') {
      console.error('CartService.add: invalid product', product);
      return;
    }

    const pid    = Number(product.id);
    const addQty = Math.max(1, Number(qty) || 1);
    const current = this.cart();
    const idx = current.findIndex(x => Number(x.id) === pid);

    if (idx > -1) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + addQty };
      this.cart.set(updated);
    } else {
      const item: CartItem = {
        id:    pid,
        name:  product.name  || 'Unnamed',
        price: Number(product.price) || 0,
        image: product.image || '',
        qty:   addQty,
      };
      this.cart.set([...current, item]);
    }

    this.persist();
  }

  // ── REMOVE ─────────────────────────────────────────────────
  remove(id: number) {
    this.cart.set(this.cart().filter(x => x.id !== id));
    this.persist();

    const lastId = localStorage.getItem('pd_last_id');
    if (lastId === String(id)) {
      localStorage.setItem('pd_qty', '1');
    }
  }

  // ── DECREASE ───────────────────────────────────────────────
  decrease(id: number) {
    const current = this.cart();
    const idx = current.findIndex(x => x.id === id);
    if (idx === -1) return;

    if (current[idx].qty <= 1) {
      this.cart.set(current.filter(x => x.id !== id));
    } else {
      const updated = [...current];
      updated[idx] = { ...updated[idx], qty: updated[idx].qty - 1 };
      this.cart.set(updated);
    }

    this.persist();
  }

  // ── CLEAR ──────────────────────────────────────────────────
  clear() {
    this.cart.set([]);
    this.persist();
  }

  // ── CHECKOUT ───────────────────────────────────────────────
  checkout() {
    if (this.cart().length === 0) return false;
    localStorage.setItem('checkoutMode', 'cart');
    this.router.navigate(['/checkout']);
    return true;
  }

  // ── SAVE SELECTED PRODUCT ──────────────────────────────────
  saveProduct(product: Product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/store-details']);
  }

  // ── FORMAT ─────────────────────────────────────────────────
  formatPrice(val: number): string {
    return val.toLocaleString('en-IN');
  }
}