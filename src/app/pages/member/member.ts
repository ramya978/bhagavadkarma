import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth';

interface MemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class MemberComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://bhagavadkarma.org/api/memberRegistration.php';

  private saved = this.authService.loadMemberDetails();
  // expose saved PAN to template for binding
  savedPan: string | undefined = this.saved?.pan;

  private isSubmitting = false;

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.isSubmitting) return; // guard against double-click while request is in flight

    const form = event.target as HTMLFormElement;
    const fname = (form.querySelector('#fname') as HTMLInputElement).value.trim();
    const lname = (form.querySelector('#lname') as HTMLInputElement).value.trim();
    const email = (form.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (form.querySelector('#phone') as HTMLInputElement).value.trim();

    if (!fname || !email || !phone) {
      this.showToastError('Please fill in all required fields.');
      return;
    }

    const payload: MemberPayload = {
      firstName: fname,
      lastName: lname,
      email,
      phone,
    };

    this.isSubmitting = true;
    this.setSubmitButtonState(form, true);

    this.http
      .post<{ success: boolean; message?: string }>(this.apiUrl, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.setSubmitButtonState(form, false);

          if (response.success) {
            this.completeMembership(fname, lname, email, phone, form);
          } else {
            console.error('API returned success:false', response);
            this.showToastError('Something went wrong. Please try again.');
          }
        },
        error: (err) => {
          console.error('Member registration failed');
          console.error('Status:', err.status);
          console.error('Error body:', err.error);
          this.isSubmitting = false;
          this.setSubmitButtonState(form, false);
          this.showToastError('Something went wrong. Please try again.');
        },
      });
  }

  private completeMembership(fname: string, lname: string, email: string, phone: string, form: HTMLFormElement) {
    const name = `${fname} ${lname}`.trim();

    // Save member details to localStorage for checkout autofill (include PAN if provided or previously saved)
    const existingPan = this.saved?.pan;
    const panInput = form.querySelector('#pan') as HTMLInputElement | null;
    const pan = panInput ? panInput.value.trim() : existingPan;

    this.authService.saveMemberDetails({ fname, lname, email, phone, pan });

    // Auto-login
    this.authService.login(name, phone, email);

    // Show success toast & redirect
    this.showToastSuccess(() => {
      this.router.navigate(['/']);
    });
  }

  private setSubmitButtonState(form: HTMLFormElement, submitting: boolean) {
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!btn) return;
    btn.disabled = submitting;
    btn.textContent = submitting ? 'Submitting...' : 'Submit';
  }

  private showToastError(msg: string) {
    const toast = document.getElementById('memberToast');
    const bar = document.getElementById('memberToastBar');
    if (!toast || !bar) return;

    this.applyToastVariant(toast, 'error');

    const titleEl = toast.querySelector('.toast-title') as HTMLElement;
    if (titleEl) titleEl.textContent = 'Submission Failed';

    const msgEl = toast.querySelector('.toast-msg') as HTMLElement;
    if (msgEl) msgEl.textContent = msg;

    this.runToastTimer(toast, bar, 3500);
  }

  private showToastSuccess(callback: () => void) {
    const toast = document.getElementById('memberToast');
    const bar = document.getElementById('memberToastBar');
    if (!toast || !bar) return;

    this.applyToastVariant(toast, 'success');

    const titleEl = toast.querySelector('.toast-title') as HTMLElement;
    if (titleEl) titleEl.textContent = 'Membership';

    const msgEl = toast.querySelector('.toast-msg') as HTMLElement;
    if (msgEl) msgEl.textContent = 'Welcome to our spiritual community.';

    this.runToastTimer(toast, bar, 3000, callback);
  }

  // swaps icon + accent color between success (green) and error (red), reusing the same toast shell
  private applyToastVariant(toast: HTMLElement, type: 'success' | 'error') {
    const iconBox = toast.querySelector('.toast-icon-box') as HTMLElement;
    const icon = toast.querySelector('.toast-icon') as HTMLElement;
    const bar = document.getElementById('memberToastBar');

    if (type === 'success') {
      if (iconBox) iconBox.style.background = 'rgb(61,73,58)';
      if (icon) {
        icon.classList.remove('fa-circle-exclamation');
        icon.classList.add('fa-user-check');
      }
      if (bar) bar.style.background = '#4a6741';
    } else {
      if (iconBox) iconBox.style.background = '#8a2e2e';
      if (icon) {
        icon.classList.remove('fa-user-check');
        icon.classList.add('fa-circle-exclamation');
      }
      if (bar) bar.style.background = '#a33d3d';
    }
  }

  private runToastTimer(toast: HTMLElement, bar: HTMLElement, duration: number, callback?: () => void) {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';

    bar.style.transitionDuration = `${duration / 1000}s`;
    bar.style.width = '0%';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      bar.style.transitionDuration = '0s';
      bar.style.width = '100%';
      if (callback) callback();
    }, duration);
  }
}