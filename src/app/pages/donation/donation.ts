import {
  Component,
  signal,
  computed,
  OnDestroy,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RAZORPAY_KEY } from '../../payment.config';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
})
export class DonationComponent implements OnDestroy {

  private auth = inject(AuthService);

  // ── Amount pills ───────────────────────────────────────────
  readonly amountPills = [
    { value: 500,  label: '500',   sub: 'A small seed'    },
    { value: 1000, label: '1,000', sub: 'Feed a family'   },
    { value: 2100, label: '2,100', sub: 'Sacred giving'   },
    { value: 5000, label: '5,000', sub: 'Transform a life'},
  ];

  // ── Step ───────────────────────────────────────────────────
  currentStep = signal(1);

  // ── Amount ─────────────────────────────────────────────────
  selectedAmount   = signal(1000);
  customAmtDisplay = signal('');
  private _customActive = false;

  isCustomActive() { return this._customActive; }

  selectPill(value: number) {
    this.selectedAmount.set(value);
    this.customAmtDisplay.set('');
    this._customActive = false;
    this.clearErr('amt');
  }

  onCustom(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this._customActive = true;
    if (!isNaN(val) && val < 100) {
      this.selectedAmount.set(0);
      this.setErr('amt');
    } else {
      this.selectedAmount.set(val > 0 ? val : 0);
      this.clearErr('amt');
    }
  }

  // ── Purpose ────────────────────────────────────────────────
  purpose = signal('General');

  // ── Member details tracking ────────────────────────────────
  // Which fields are locked (came from saved member)
  lockedFields = signal<Record<string, boolean>>({});

  // ── Donor fields ───────────────────────────────────────────
  dFirst   = '';
  dLast    = '';
  dEmail   = '';
  dPhone   = '';
  dPan     = '';
  dAddress = '';

  // ── Auto-fill from member details (localStorage) ──────────
  private _memberSync = effect(() => {
    const md = this.auth.memberDetails?.();  // reactive signal

    if (md) {
      // Fill only if empty (don't overwrite user edits)
      const locked: Record<string, boolean> = {};

      if (md.fname) { this.dFirst = md.fname; locked['first'] = true; }
      if (md.lname) { this.dLast  = md.lname; locked['last']  = true; }
      if (md.email) { this.dEmail = md.email;  locked['email'] = true; }
      if (md.phone) { this.dPhone = md.phone;  locked['phone'] = true; }
      if (md.pan)   { this.dPan   = md.pan;    locked['pan']   = true; }

      this.lockedFields.set(locked);
    }
  });

  // Helper: is a field readonly (came from member data)?
  isLocked(field: string): boolean {
    return !!this.lockedFields()[field];
  }

  // ── Errors ─────────────────────────────────────────────────
  errors = signal<Record<string, boolean>>({});

  clearErr(key: string) {
    this.errors.update(e => ({ ...e, [key]: false }));
  }
  private setErr(key: string) {
    this.errors.update(e => ({ ...e, [key]: true }));
  }

  // ── Payment state ──────────────────────────────────────────
  donating       = signal(false);
  payError       = signal('');
  successVisible = signal(false);
  failVisible    = signal(false);
  paymentId      = signal('');
  failTxnId      = signal('');
  failTime       = signal('');

  // ── Toast ──────────────────────────────────────────────────
  toastVisible = signal(false);
  toastMsg     = signal('');
  private toastTimer: any;

  showToast(msg: string) {
    this.toastMsg.set(msg);
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 2800);
  }

  ngOnDestroy() {
    clearTimeout(this.toastTimer);
  }

  // ── Validate ───────────────────────────────────────────────
  private validateStep(step: number): boolean {
    this.errors.set({});
    let valid = true;

    if (step === 1) {
      if (!this.selectedAmount() || this.selectedAmount() < 100) {
        this.setErr('amt'); valid = false;
      }
    }

    if (step === 2) {
      if (!this.dFirst.trim())                                                 { this.setErr('first'); valid = false; }
      if (!this.dEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.dEmail)) { this.setErr('email'); valid = false; }
      if (!this.dPhone.trim() || this.dPhone.replace(/\D/g, '').length < 10)  { this.setErr('phone'); valid = false; }
    }

    return valid;
  }

  // ── Step navigation ────────────────────────────────────────
  goStep(n: number) {
    if (n > this.currentStep() && !this.validateStep(this.currentStep())) return;
    this.payError.set('');
    this.currentStep.set(n);
    setTimeout(() => {
      const el = document.querySelector('.donate-stepper-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  // ── Razorpay ───────────────────────────────────────────────
  processDonation() {
    this.payError.set('');

    // Validate amount before opening Razorpay
    if (!this.selectedAmount() || this.selectedAmount() < 100) {
      this.setErr('amt');
      return;
    }

    this.donating.set(true);

    let failureMessage = '';

    const options: any = {
      key: RAZORPAY_KEY,
      amount: this.selectedAmount() * 100,
      currency: 'INR',
      name: 'Bhagavad Karma',
      description: 'Donation — ' + this.purpose(),
      image: 'assets/images/logo/BHAGAVADKARMA - Logo.svg',

      notes: {
        pan:     this.dPan,
        purpose: this.purpose(),
      },
      theme: { color: 'pink' },
      retry: { enabled: false },
      handler: (response: any) => {
        this.donating.set(false);
        this.paymentId.set(response.razorpay_payment_id);
        this.successVisible.set(true);
      },
      modal: {
        ondismiss: () => {
          this.donating.set(false);
          if (failureMessage) {
            this.payError.set(failureMessage);
            this.failVisible.set(true);
            failureMessage = '';
          }
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (resp: any) => {
      failureMessage = resp.error.description || 'Something went wrong. Please try again.';
      this.failTxnId.set(resp.error?.metadata?.payment_id || '');
      this.failTime.set(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    });
    rzp.open();
  }

  closeFailure() {
    this.failVisible.set(false);
    this.payError.set('');
    this.failTxnId.set('');
    this.failTime.set('');
  }

  // ── Copy payment ID ────────────────────────────────────────
  copyPaymentId() {
    const id = this.paymentId();
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => {
      this.showToast('Payment ID copied!');
    });
  }
}