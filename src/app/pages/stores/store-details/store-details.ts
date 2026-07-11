import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ElementRef,
  ViewChild,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../Models/product.model';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { RAZORPAY_KEY } from '../../../payment.config';

@Component({
  selector: 'app-store-details',
  imports: [RouterLink, FormsModule],
  templateUrl: './store-details.html',
  styleUrl: './store-details.css',
})
export class StoreDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('zoomWrap')   zoomWrap!:   ElementRef<HTMLDivElement>;
  @ViewChild('mainImg')    mainImg!:    ElementRef<HTMLImageElement>;
  @ViewChild('zoomResult') zoomResult!: ElementRef<HTMLDivElement>;

  cartService = inject(CartService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      const cart    = this.cartService.cart();
      const product = this.product();
      if (!product) return;
      const cartItem = cart.find(x => Number(x.id) === Number(product.id));
      if (!cartItem) {
        this.qty.set(1);
        localStorage.setItem('pd_qty', '1');
      } else {
        this.qty.set(cartItem.qty);
        localStorage.setItem('pd_qty', String(cartItem.qty));
      }
      this.cdr.markForCheck();
    }, { allowSignalWrites: true });
  }

  // ── Zoom config ──────────────────────────────────────────
  private readonly SEL_W   = 120;
  private readonly SEL_H   = 120;
  private readonly ZOOM    = 3.2;
  private readonly PANEL_W = 420;
  private readonly PANEL_H = 420;

  // ── Core signals ─────────────────────────────────────────
  product        = signal<Product | null>(null);
  qty            = signal<number>(Math.max(1, parseInt(localStorage.getItem('pd_qty') || '1', 10) || 1));
  lightboxOpen   = signal(false);
  toastVisible   = signal(false);
  toastMessage   = signal('');
  toastIsError   = signal(false);
  toast1Visible  = signal(false);
  otppassword    = signal(false);

  // ── Image gallery / zoom ──────────────────────────────────
  activeImageIndex = signal(0);
  showZoom         = signal(false);
  selectorX        = signal(0);
  selectorY        = signal(0);
  zoomBgSize       = signal('');
  zoomBgPos        = signal('');
  zoomPanelTop     = signal(0);
  zoomPanelLeft    = signal(0);

  // ── Checkout modal ────────────────────────────────────────
  checkoutOpen = signal(false);
  checkoutMode = signal<'single' | 'cart'>('single');
  summaryItems = signal<{ name: string; qty: number; price: number }[]>([]);
  grandTotal   = signal(0);
  gstAmount    = signal(0);
  subtotal     = signal(0);

  // ── Member / OTP ─────────────────────────────────────────
  isMemberMode      = signal(false);
  otpVerified       = signal(false);
  otpSent           = signal(false);
  generatedOtp      = signal('');
  otpInput          = signal('');
  memPhone          = signal('');
  memAddress        = signal('');
  otpStatus         = signal('');
  otpStatusClass    = signal('');
  countdownSec      = signal(0);
  showResend        = signal(false);
  showVerifyBtn     = signal(false);
  showVerifiedBadge = signal(false);
  otpInputError     = signal('');
  memPhoneError     = signal('');
  memAddressError   = signal('');

  // ── Guest form ────────────────────────────────────────────
  fname = ''; lname = ''; email = ''; phone = ''; address = '';
  fnameError   = signal('');
  emailError   = signal('');
  phoneError   = signal('');
  addressError = signal('');

  // ── Success ───────────────────────────────────────────────
  successVisible = signal(false);
  orderId        = signal('—');

  // ── Timers ────────────────────────────────────────────────
  private countdownTimer: any;
  private toastTimer:     any;
  private toast1Timer:    any;
  private otpToastTimer:  any;

  readonly GST_RATE = 0.18;

  readonly FALLBACK_PRODUCT: Product = {
    id: 1, name: 'Herbal Face Cream', category: 'Skincare',
    badge: 'New', badgeClass: '', price: 799, oldPrice: 999,
    desc: 'Natural herbal cream for glowing, hydrated & healthy skin.',
    image: 'images/Product/shopping1.webp',
  };

  // ── Computed ──────────────────────────────────────────────
  discount = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  });

  memPhoneValid = computed(() =>
    /^(\+91)?[6-9]\d{9}$/.test(this.memPhone().replace(/\s+/g, ''))
  );

  productImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    return [p.image, p.image, p.image, p.image];
  });

  isProductInCart = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.cartService.cart().some(x => Number(x.id) === Number(p.id));
  });

  // ── Saved member from localStorage (bk_member_details) ───
  savedMember = computed(() => this.authService.memberDetails());

  savedMemberName = computed(() => {
    const m = this.savedMember();
    if (!m) return '';
    return [m.fname, m.lname].filter(Boolean).join(' ');
  });

  savedMemberEmail = computed(() => this.savedMember()?.email || '');
  savedMemberPhone = computed(() => this.savedMember()?.phone || '');

  /**
   * hasSavedMember: bk_member_details localStorage-ல் இருந்தா true
   * இந்த case-ல் member checkbox காட்டலை, directly readonly form show ஆகும்
   */
  hasSavedMember = computed(() => this.savedMember() !== null);

  /**
   * isFullyLoggedIn: AuthService.isLoggedIn() — bk_user key
   */
  isFullyLoggedIn = computed(() => this.authService.isLoggedIn());

  canPay(): boolean {
    const phoneRx = /^[+]?[\d\s\-]{7,15}$/;
    if (this.isMemberMode()) {
      // logged in or saved member → just need address
      if (this.isFullyLoggedIn() || this.hasSavedMember()) {
        return this.memAddress().trim().length > 0;
      }
      // OTP flow
      return this.otpVerified() && this.memPhoneValid() && this.memAddress().trim().length > 0;
    }
    return (
      this.fname.trim().length > 0 &&
      phoneRx.test(this.phone.trim()) &&
      this.address.trim().length > 0
    );
  }

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit() {
    const raw        = localStorage.getItem('selectedProduct');
    const newProduct = raw ? JSON.parse(raw) : this.FALLBACK_PRODUCT;
    const lastId     = localStorage.getItem('pd_last_id');

    if (lastId && lastId !== String(newProduct.id)) {
      this.qty.set(1);
      localStorage.setItem('pd_qty', '1');
    } else {
      const existingItem = this.cartService.cart()
        .find(x => Number(x.id) === Number(newProduct.id));
      const savedQty = Math.max(1, parseInt(localStorage.getItem('pd_qty') || '1', 10) || 1);
      this.qty.set(existingItem ? existingItem.qty : savedQty);
    }

    localStorage.setItem('pd_last_id', String(newProduct.id));
    this.product.set(newProduct);

    if (localStorage.getItem('checkoutMode') === 'cart') {
      localStorage.removeItem('checkoutMode');
      setTimeout(() => this.openCheckout('cart'), 300);
    }
  }

  ngOnDestroy() {
    clearInterval(this.countdownTimer);
    clearTimeout(this.toastTimer);
    clearTimeout(this.toast1Timer);
    clearTimeout(this.otpToastTimer);
  }

  // ── Gallery ───────────────────────────────────────────────
  setActiveImage(index: number) { this.activeImageIndex.set(index); }

  // ── Zoom ──────────────────────────────────────────────────
  onMouseEnter() { this.showZoom.set(true); }
  onMouseLeave() { this.showZoom.set(false); }

  onMouseMove(event: MouseEvent) {
    const wrap = this.zoomWrap?.nativeElement;
    if (!wrap) return;
    const rc  = wrap.getBoundingClientRect();
    const sx  = Math.max(0, Math.min(rc.width  - this.SEL_W, event.clientX - rc.left - this.SEL_W / 2));
    const sy  = Math.max(0, Math.min(rc.height - this.SEL_H, event.clientY - rc.top  - this.SEL_H / 2));
    this.selectorX.set(sx);
    this.selectorY.set(sy);
    this.zoomBgSize.set(`${rc.width * this.ZOOM}px ${rc.height * this.ZOOM}px`);
    this.zoomBgPos.set(`-${sx * this.ZOOM}px -${sy * this.ZOOM}px`);
    let panelLeft = rc.right + 12;
    let panelTop  = rc.top;
    if (panelLeft + this.PANEL_W > window.innerWidth - 8) panelLeft = rc.left - this.PANEL_W - 12;
    panelTop = Math.max(8, Math.min(window.innerHeight - this.PANEL_H - 8, panelTop));
    this.zoomPanelTop.set(panelTop);
    this.zoomPanelLeft.set(panelLeft);
  }

  // ── Lightbox ──────────────────────────────────────────────
  openLightbox()  { this.lightboxOpen.set(true);  document.body.style.overflow = 'hidden'; }
  closeLightbox() { this.lightboxOpen.set(false); document.body.style.overflow = ''; }

  // ── Quantity ──────────────────────────────────────────────
  changeQty(delta: number) {
    const p = this.product();
    if (!p) return;
    const currentQty = this.cartService.cart()
      .find(x => Number(x.id) === Number(p.id))?.qty || 0;
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (delta > 0) {
      this.cartService.add(p, 1);
      this.showToast(`"${p.name}" added to cart!`, false);
    } else {
      this.cartService.decrease(p.id);
    }
  }

  // ── Add to Cart ───────────────────────────────────────────
  addToCart() {
    const p = this.product();
    if (!p) return;
    const currentCartQty = this.cartService.cart()
      .find(x => Number(x.id) === Number(p.id))?.qty || 0;
    const toAdd = Math.max(1, this.qty() - currentCartQty);
    if (toAdd > 0) this.cartService.add(p, toAdd);
    this.showToast(`"${p.name}" (×${this.qty()}) added to cart!`, false);
  }

  // ── Buy Now ───────────────────────────────────────────────
  buyNow() { this.openCheckout('single'); }

  // ── Open Checkout ─────────────────────────────────────────
  openCheckout(mode: 'single' | 'cart') {
    this.checkoutMode.set(mode);

    let items: { name: string; qty: number; price: number }[] = [];
    let sub = 0;

    if (mode === 'single') {
      const p = this.product();
      if (!p) return;
      sub   = p.price * this.qty();
      items = [{ name: p.name, qty: this.qty(), price: p.price }];
    } else {
      const cart = this.cartService.cart();
      if (cart.length === 0) { this.showToast('Your cart is empty!', true); return; }
      items = cart.map(x => ({ name: x.name, qty: x.qty, price: x.price }));
      sub   = cart.reduce((s, x) => s + x.price * x.qty, 0);
    }

    const gst   = Math.round(sub * this.GST_RATE);
    const total = sub + gst;
    this.summaryItems.set(items);
    this.subtotal.set(sub);
    this.gstAmount.set(gst);
    this.grandTotal.set(total);

    this._resetState();

    /*
     * Auto-detect mode:
     * 1. isLoggedIn()        → member mode (bk_user)
     * 2. hasSavedMember()    → member mode (bk_member_details), show readonly
     * 3. neither             → guest mode, show checkbox to switch
     */
    if (this.isFullyLoggedIn() || this.hasSavedMember()) {
      this.isMemberMode.set(true);
    }

    this.checkoutOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeCheckout() {
    this.checkoutOpen.set(false);
    this._resetState();
    document.body.style.overflow = '';
  }

  private _resetState() {
    // Don't reset isMemberMode here — it's set based on login status in openCheckout
    this.otpVerified.set(false);
    this.otpSent.set(false);
    this.generatedOtp.set('');
    this.otpInput.set('');
    this.memPhone.set('');
    this.memAddress.set('');
    this.showVerifyBtn.set(false);
    this.showVerifiedBadge.set(false);
    this.showResend.set(false);
    this.otpStatus.set('');
    this.otpStatusClass.set('');
    this.otpInputError.set('');
    this.memPhoneError.set('');
    this.memAddressError.set('');
    this.fnameError.set(''); this.emailError.set('');
    this.phoneError.set(''); this.addressError.set('');
    this.fname = ''; this.lname = ''; this.email = '';
    this.phone = ''; this.address = '';
    clearInterval(this.countdownTimer);
  }

  // ── Toggle member mode (only when NOT logged in and NO saved member) ──
  toggleMemberMode() {
    if (this.isFullyLoggedIn() || this.hasSavedMember()) return; // locked
    const next = !this.isMemberMode();
    this._resetState();
    this.isMemberMode.set(next);
  }

  // ── OTP ───────────────────────────────────────────────────
  onMemPhoneChange() { this.memPhoneError.set(''); }

  sendOtp() {
    if (!this.memPhoneValid()) {
      this.memPhoneError.set('Enter a valid 10-digit mobile number.');
      return;
    }
    this.memPhoneError.set('');
    this.generatedOtp.set(String(Math.floor(100000 + Math.random() * 900000)));
    this.otpSent.set(true);
    this.showVerifyBtn.set(true);
    this.showVerifiedBadge.set(false);
    this.otpVerified.set(false);
    this.otpInput.set('');
    this.otpInputError.set('');
    this.otpStatus.set('OTP sent to ' + this.memPhone());
    this.otpStatusClass.set('otp-status info');
    this.otppassword.set(true);
    clearTimeout(this.otpToastTimer);
    this.otpToastTimer = setTimeout(() => this.otppassword.set(false), 15000);
    this.startCountdown(30);
    console.log(`%c[DEV] OTP → ${this.generatedOtp()}`, 'color:green;font-size:15px;font-weight:bold;');
  }

  resendOtp() {
    this.generatedOtp.set(String(Math.floor(100000 + Math.random() * 900000)));
    this.otpInput.set('');
    this.otpInputError.set('');
    this.otpVerified.set(false);
    this.showVerifyBtn.set(true);
    this.showVerifiedBadge.set(false);
    this.otpStatus.set('New OTP sent.');
    this.otpStatusClass.set('otp-status info');
    this.otppassword.set(true);
    clearTimeout(this.otpToastTimer);
    this.otpToastTimer = setTimeout(() => this.otppassword.set(false), 15000);
    this.startCountdown(30);
    console.log(`%c[DEV] RESEND → ${this.generatedOtp()}`, 'color:orange;font-size:15px;font-weight:bold;');
  }

  verifyOtp() {
    const entered = this.otpInput().trim();
    if (!entered) { this.otpInputError.set('Please enter the OTP.'); return; }
    if (entered !== this.generatedOtp()) {
      this.otpInputError.set('Incorrect OTP. Please try again.');
      this.otpStatus.set('Verification failed.');
      this.otpStatusClass.set('otp-status error');
      return;
    }
    this.otpVerified.set(true);
    clearInterval(this.countdownTimer);
    this.otpInputError.set('');
    this.otpStatus.set('✓ Phone verified successfully!');
    this.otpStatusClass.set('otp-status success');
    this.showVerifyBtn.set(false);
    this.showResend.set(false);
    this.showVerifiedBadge.set(true);
    this.otpSent.set(false);
    this.otppassword.set(false);
  }

  startCountdown(sec: number) {
    clearInterval(this.countdownTimer);
    this.countdownSec.set(sec);
    this.showResend.set(true);
    this.countdownTimer = setInterval(() => {
      this.countdownSec.update(v => v - 1);
      if (this.countdownSec() <= 0) clearInterval(this.countdownTimer);
    }, 1000);
  }

  // ── Razorpay ──────────────────────────────────────────────
  triggerRazorpay() {
    // ── Member / Saved member mode ──
    if (this.isMemberMode()) {
      // If neither logged in nor OTP verified → block
      if (!this.isFullyLoggedIn() && !this.hasSavedMember() && !this.otpVerified()) {
        this.otpStatus.set('Please verify your phone number first.');
        this.otpStatusClass.set('otp-status error');
        return;
      }
      if (!this.memAddress().trim()) {
        this.memAddressError.set('Delivery address is required.');
        return;
      }
      this.memAddressError.set('');
    } else {
      // ── Guest mode ──
      let hasError = false;
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRx = /^[+]?[\d\s\-]{7,15}$/;
      this.fnameError.set(''); this.emailError.set('');
      this.phoneError.set(''); this.addressError.set('');
      if (!this.fname.trim())                    { this.fnameError.set('First name is required');        hasError = true; }
      if (!this.email.trim())                    { this.emailError.set('Email is required');              hasError = true; }
      else if (!emailRx.test(this.email.trim())) { this.emailError.set('Enter a valid email');            hasError = true; }
      if (!this.phone.trim())                    { this.phoneError.set('Phone number is required');       hasError = true; }
      else if (!phoneRx.test(this.phone.trim())) { this.phoneError.set('Enter a valid phone number');     hasError = true; }
      if (!this.address.trim())                  { this.addressError.set('Delivery address is required'); hasError = true; }
      if (hasError) return;
    }

    // ── Build prefill ──
    let name: string, email: string, phone: string;

    if (this.isFullyLoggedIn()) {
      name  = this.authService.userName();
      email = this.authService.userEmail();
      phone = this.authService.userPhone();
    } else if (this.hasSavedMember()) {
      name  = this.savedMemberName();
      email = this.savedMemberEmail();
      phone = this.savedMemberPhone();
    } else if (this.isMemberMode()) {
      name  = 'Member';
      email = '';
      phone = this.memPhone();
    } else {
      name  = `${this.fname} ${this.lname}`.trim();
      email = this.email;
      phone = this.phone;
    }

    const address = this.memAddress().trim() || this.address;
    const desc    = this.summaryItems().map(i => `${i.name}×${i.qty}`).join(', ');

    const options: any = {
      key:         RAZORPAY_KEY,
      amount:      this.grandTotal() * 100,
      currency:    'INR',
      name:        'Swami Of The South',
      description: desc,
      image:       'assets/images/logo_1.webp',
      prefill:     { name, email, contact: phone.replace(/\s+/g, '') },
      notes:       { address, items: desc },
      theme:       { color: '#4a6741' },
      handler: (response: any) => {
        this.closeCheckout();
        this.cartService.clear();
        this.orderId.set(response.razorpay_payment_id);
        this.successVisible.set(true);
        document.body.style.overflow = 'hidden';
      },
      modal: { ondismiss: () => {} },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      if (this.isMemberMode()) {
        this.otpStatus.set('Payment failed: ' + r.error.description);
        this.otpStatusClass.set('otp-status error');
      } else {
        this.phoneError.set('Payment failed: ' + r.error.description);
      }
    });
    rzp.open();
  }

  closeSuccess() {
    this.successVisible.set(false);
    document.body.style.overflow = '';
  }

  copyOrderId() {
    const id = this.orderId();
    if (!id || id === '—') return;
    navigator.clipboard.writeText(id).then(() => this.showToast1());
  }

  showToast(msg: string, isError: boolean) {
    this.toastMessage.set(msg);
    this.toastIsError.set(isError);
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 3200);
  }

  showToast1() {
    this.toast1Visible.set(true);
    clearTimeout(this.toast1Timer);
    this.toast1Timer = setTimeout(() => this.toast1Visible.set(false), 2800);
  }
}