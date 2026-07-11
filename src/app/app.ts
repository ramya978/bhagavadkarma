import {
  Component, OnInit, OnDestroy, HostListener,
  inject, signal, computed, ChangeDetectorRef, effect
} from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CartService } from './services/cart';
import { AuthService } from './services/auth';
import { FormsModule } from '@angular/forms';
import { CartItem } from './Models/product.model';
import { RAZORPAY_KEY } from './payment.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {

  cartService = inject(CartService);
  authService = inject(AuthService);
  private router = inject(Router);
  private cdr    = inject(ChangeDetectorRef);

  isMenuOpen = signal(false);

  toggleMenu() {
    const next = !this.isMenuOpen();
    this.isMenuOpen.set(next);
    document.body.classList.toggle('mobile-menu-open', next);
  }

  toggleSubmenu(event: MouseEvent) {
    event.preventDefault();
    const li = (event.currentTarget as HTMLElement)?.closest('li');
    if (li) li.classList.toggle('open');
  }
  readonly GST_RATE = 0.18;

  /* ── UI state ──────────────────────────────────────────── */
  cartDrawerOpen  = signal(false);
  checkoutOpen    = signal(false);
  checkoutMode    = signal<'single' | 'cart'>('cart');
  successVisible  = signal(false);
  orderId         = signal('—');
  toastVisible    = signal(false);
  toastMessage    = signal('');
  toastIsError    = signal(false);
  toast1Visible   = signal(false);
  profileOpen     = signal(false);
  loginOpen       = signal(false);

  /* ── Login ─────────────────────────────────────────────── */
  loginPhone         = signal('');
  loginPassword      = signal('');
  loginShowOtp       = signal(false);
  loginOtpInput      = signal('');
  loginOtpError      = signal('');
  loginPhoneError    = signal('');
  loginPasswordError = signal('');

  /* ── Checkout summary ──────────────────────────────────── */
  summaryItems = signal<{ name: string; qty: number; price: number }[]>([]);
  subtotal     = signal(0);
  gstAmount    = signal(0);
  grandTotal   = signal(0);

  drawerGst   = computed(() => Math.round(this.cartService.totalAmt() * this.GST_RATE));
  drawerTotal = computed(() => Math.round(this.cartService.totalAmt() + this.drawerGst()));

  /* ── Member / OTP ──────────────────────────────────────── */
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
  otpToastVisible   = signal(false);

  /* ── Guest fields ──────────────────────────────────────── */
  fname = ''; lname = ''; email = ''; phone = ''; address = '';
  fnameError   = signal('');
  emailError   = signal('');
  phoneError   = signal('');
  addressError = signal('');

  /* ── Timers ────────────────────────────────────────────── */
  private countdownTimer: any;
  private toastTimer:     any;
  private toast1Timer:    any;
  private otpToastTimer:  any;

  /* ── Computed ──────────────────────────────────────────── */
  cartCount = signal(0);

  memPhoneValid = computed(() =>
    /^(\+91)?[6-9]\d{9}$/.test(this.memPhone().replace(/\s+/g, ''))
  );

  /* Saved member from localStorage — reactive via AuthService */
  savedMember = computed(() => this.authService.memberDetails());

  savedMemberName = computed(() => {
    const m = this.savedMember();
    return m ? `${m.fname} ${m.lname}`.trim() : '';
  });
  savedMemberEmail = computed(() => this.savedMember()?.email ?? '');
  savedMemberPhone = computed(() => this.savedMember()?.phone ?? '');

  /* ── canPay ────────────────────────────────────────────────
     3 cases:
     1. Logged-in member → need address only
     2. Saved member (not logged in) → need address only
     3. Guest → need fname + phone + address
     4. Guest member mode (OTP) → need OTP verified + address
  ────────────────────────────────────────────────────────── */
  canPay(): boolean {
    const phoneRx = /^[+]?\d[\d\s\-]{6,14}$/;

    // Case 1 & 2: member data available (logged in OR localStorage)
    if (this.authService.isLoggedIn() || this.savedMember()) {
      return this.memAddress().trim().length > 0;
    }

    // Case 4: guest chose member mode with OTP
    if (this.isMemberMode()) {
      return this.otpVerified() && this.memAddress().trim().length > 0;
    }

    // Case 3: pure guest
    return (
      this.fname.trim().length > 0 &&
      phoneRx.test(this.phone.trim()) &&
      this.address.trim().length > 0
    );
  }

  constructor() {
    effect(() => {
      const cart = this.cartService.cart();
      this.cartCount.set(cart.reduce((s, x) => s + x.qty, 0));
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    clearInterval(this.countdownTimer);
    clearTimeout(this.toastTimer);
    clearTimeout(this.toast1Timer);
    clearTimeout(this.otpToastTimer);
  }

  /* ── Scroll ────────────────────────────────────────────── */
  onScroll = () => {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.classList.toggle('show', window.scrollY > 300);
  };

  scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  /* ── Profile ───────────────────────────────────────────── */
  toggleProfile() { this.profileOpen.update(v => !v); }
  closeProfile()  { this.profileOpen.set(false); }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.profileOpen() && !target.closest('.header-profile')) {
      this.profileOpen.set(false);
    }
  }

  doLogout() {
    this.authService.logout();
    this.closeProfile();
    this.showToast('Logged out successfully.', false);
  }

  /* ── Login Popup ───────────────────────────────────────── */
  openLogin() {
    this.closeProfile();
    this.resetLogin();
    this.loginOpen.set(true);
  }
  closeLogin() { this.loginOpen.set(false); }

  resetLogin() {
    this.loginPhone.set('');
    this.loginPassword.set('');
    this.loginShowOtp.set(false);
    this.loginOtpInput.set('');
    this.loginOtpError.set('');
    this.loginPhoneError.set('');
    this.loginPasswordError.set('');
  }

  loginSendOtp() {
    const phone = this.loginPhone().replace(/\s+/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) {
      this.loginPhoneError.set('Enter a valid 10-digit mobile number.');
      return;
    }
    this.loginPhoneError.set('');
    this.generatedOtp.set(String(Math.floor(100000 + Math.random() * 900000)));
    this.loginShowOtp.set(true);
    this.otpToastVisible.set(true);
    clearTimeout(this.otpToastTimer);
    this.otpToastTimer = setTimeout(() => this.otpToastVisible.set(false), 15000);
  }

  loginVerifyOtp() {
    if (!this.loginOtpInput()) { this.loginOtpError.set('Please enter the OTP.'); return; }
    if (this.loginOtpInput() !== this.generatedOtp()) {
      this.loginOtpError.set('Incorrect OTP. Try again.'); return;
    }
    this.authService.login('Member', this.loginPhone());
    this.closeLogin();
    this.showToast('Logged in successfully!', false);
  }

  goToMember() {
    this.closeProfile();
    this.closeLogin();
    this.router.navigate(['/member']);
  }

  /* ── Cart Drawer ───────────────────────────────────────── */
  openCartDrawer()  { this.cartDrawerOpen.set(true);  document.body.style.overflow = 'hidden'; }
  closeCartDrawer() { this.cartDrawerOpen.set(false); document.body.style.overflow = ''; }

  /* ── Checkout ──────────────────────────────────────────── */
  openCheckout(mode: 'single' | 'cart') {
    this.checkoutMode.set(mode);
    this.closeCartDrawer();

    const cart = this.cartService.cart();
    if (cart.length === 0) { this.showToast('Your cart is empty!', true); return; }

    const items  = cart.map(x => ({ name: x.name, qty: x.qty, price: x.price }));
    const sub    = cart.reduce((s, x) => s + x.price * x.qty, 0);
    const gst    = Math.round(sub * this.GST_RATE);
    const total  = sub + gst;

    this.summaryItems.set(items);
    this.subtotal.set(sub);
    this.gstAmount.set(gst);
    this.grandTotal.set(total);

    this.resetCheckoutState();
    this.checkoutOpen.set(true);
  }

  closeCheckout() {
    this.checkoutOpen.set(false);
    this.resetCheckoutState();
  }

  resetCheckoutState() {
    /* If logged in or savedMember → member mode auto, else guest */
    const hasMemberData = this.authService.isLoggedIn() || !!this.savedMember();
    this.isMemberMode.set(hasMemberData);

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
    this.fnameError.set('');
    this.emailError.set('');
    this.phoneError.set('');
    this.addressError.set('');
    this.fname = ''; this.lname = ''; this.email = '';
    this.phone = ''; this.address = '';
    clearInterval(this.countdownTimer);
  }

  toggleMemberMode() {
    /* Don't allow toggle when logged in or savedMember exists */
    if (this.authService.isLoggedIn() || this.savedMember()) return;
    const current = this.isMemberMode();
    this.resetCheckoutState();
    this.isMemberMode.set(!current);
  }

  /* ── OTP Flow ──────────────────────────────────────────── */
  onMemPhoneChange() { this.memPhoneError.set(''); }

  sendOtp() {
    if (!this.memPhoneValid()) { this.memPhoneError.set('Enter a valid 10-digit mobile number.'); return; }
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
    this.otpToastVisible.set(true);
    clearTimeout(this.otpToastTimer);
    this.otpToastTimer = setTimeout(() => this.otpToastVisible.set(false), 15000);
    this.startCountdown(30);
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
    this.otpToastVisible.set(true);
    clearTimeout(this.otpToastTimer);
    this.otpToastTimer = setTimeout(() => this.otpToastVisible.set(false), 15000);
    this.startCountdown(30);
  }

  verifyOtp() {
    if (!this.otpInput()) { this.otpInputError.set('Please enter the OTP.'); return; }
    if (this.otpInput() !== this.generatedOtp()) {
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

  /* ── Razorpay ──────────────────────────────────────────── */
  triggerRazorpay() {
    let name = '', email = '', phone = '', address = '';

    /* Case 1: Logged-in member */
    if (this.authService.isLoggedIn()) {
      if (!this.memAddress().trim()) { this.memAddressError.set('Delivery address is required.'); return; }
      name    = this.authService.userName();
      email   = this.authService.userEmail();
      phone   = this.authService.userPhone() || '';
      address = this.memAddress();
    }
    /* Case 2: savedMember */
    else if (this.savedMember()) {
      if (!this.memAddress().trim()) { this.memAddressError.set('Delivery address is required.'); return; }
      const m = this.savedMember()!;
      name    = `${m.fname} ${m.lname}`.trim();
      email   = m.email;
      phone   = m.phone;
      address = this.memAddress();
    }
    /* Case 4: guest chose member mode + OTP */
    else if (this.isMemberMode()) {
      if (!this.otpVerified()) {
        this.otpStatus.set('Please verify your phone number first.');
        this.otpStatusClass.set('otp-status error');
        return;
      }
      if (!this.memAddress().trim()) { this.memAddressError.set('Delivery address is required.'); return; }
      name    = 'Member';
      phone   = this.memPhone();
      address = this.memAddress();
    }
    /* Case 3: pure guest */
    else {
      let hasError   = false;
      const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRx  = /^[+]?\d[\d\s\-]{6,14}$/;
      this.fnameError.set(''); this.emailError.set('');
      this.phoneError.set(''); this.addressError.set('');
      if (!this.fname.trim())                    { this.fnameError.set('First name is required');        hasError = true; }
      if (!this.email.trim())                    { this.emailError.set('Email is required');              hasError = true; }
      else if (!emailRx.test(this.email.trim())) { this.emailError.set('Enter a valid email');            hasError = true; }
      if (!this.phone.trim())                    { this.phoneError.set('Phone number is required');       hasError = true; }
      else if (!phoneRx.test(this.phone.trim())) { this.phoneError.set('Enter a valid phone number');     hasError = true; }
      if (!this.address.trim())                  { this.addressError.set('Delivery address is required'); hasError = true; }
      if (hasError) return;
      name    = `${this.fname} ${this.lname}`.trim();
      email   = this.email;
      phone   = this.phone;
      address = this.address;
    }

    const desc = this.summaryItems().map(i => `${i.name}×${i.qty}`).join(', ');

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
        if (this.checkoutMode() === 'cart') this.cartService.clear();
        this.orderId.set(response.razorpay_payment_id);
        this.successVisible.set(true);
        document.body.style.overflow = 'hidden';
      },
      modal: { ondismiss: () => {} }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      this.showToast('Payment failed: ' + r.error.description, true);
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
    navigator.clipboard.writeText(id).then(() => this.showToast1()).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = id; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta); this.showToast1();
    });
  }

  /* ── Toast ─────────────────────────────────────────────── */
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

  formatPrice(val: number): string {
    return val.toLocaleString('en-IN');
  }

  /* ── Cart Qty Controls ─────────────────────────────────── */
  increaseCartQty(item: CartItem) {
    this.cartService.add({
      id: item.id, name: item.name, price: item.price,
      image: item.image, badge: '', badgeClass: '',
      category: '', desc: '', oldPrice: item.price
    }, 1);
  }

  decreaseCartQty(item: CartItem) {
    this.cartService.decrease(item.id);
  }
}