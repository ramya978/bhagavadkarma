import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

type ToastState = 'success' | 'error' | null;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  public  apiUrl = 'https://bhagavadkarma.org/api/contactmail.php';

  // form model
  formData = signal<ContactPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  // ui state
  isSubmitting = signal(false);
  toast = signal<ToastState>(null);
  toastBarWidth = signal('100%');

  private toastTimeoutId?: ReturnType<typeof setTimeout>;
  private toastBarTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(private http: HttpClient) {}

  updateField(field: keyof ContactPayload, value: string) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      return;
    }

    this.isSubmitting.set(true);

this.http.post<{ success: boolean; message?: string }>(this.apiUrl, this.formData()).subscribe({
  next: (response) => {
    this.isSubmitting.set(false);
    if (response.success) {
      this.showToast('success');
      this.resetForm(form);
    } else {
      console.error('API returned success:false', response);
      this.showToast('error');
    }
  },
  error: (err) => {
    console.error('Contact form submission failed');
    console.error('Status:', err.status);
    console.error('Error body:', err.error);
    this.isSubmitting.set(false);
    this.showToast('error');
  },
});
  }

  private resetForm(form: NgForm) {
    form.resetForm();
    this.formData.set({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
  }

  private showToast(type: 'success' | 'error') {
    clearTimeout(this.toastTimeoutId);
    clearTimeout(this.toastBarTimeoutId);

    this.toastBarWidth.set('100%');
    this.toast.set(type);

    // kick off the bar shrink on next tick so the transition has something to animate from
    this.toastBarTimeoutId = setTimeout(() => this.toastBarWidth.set('0%'), 50);

    // auto-dismiss after 4.5s
    this.toastTimeoutId = setTimeout(() => this.toast.set(null), 4500);
  }

  dismissToast() {
    clearTimeout(this.toastTimeoutId);
    clearTimeout(this.toastBarTimeoutId);
    this.toast.set(null);
  }
}