import { computed, Injectable, signal } from '@angular/core';

export interface MemberDetails {
  name: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'bk_user';
  private readonly MEMBER_KEY = 'bk_member_details';

  private userSignal = signal<MemberDetails | null>(this.loadUser());
  // reactive member details (used for forms like donation/member)
  memberDetails = signal<{ fname: string; lname: string; email: string; phone: string; pan?: string } | null>(this.loadMemberDetails());

  isLoggedIn = computed(() => this.userSignal() !== null);
  userName = computed(() => this.userSignal()?.name || 'Guest User');
  userPhone = computed(() => this.userSignal()?.phone || '');
  userEmail = computed(() => this.userSignal()?.email || '');

  private loadUser(): MemberDetails | null {
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  private persist(user: MemberDetails | null) {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  loadMemberDetails(): { fname: string; lname: string; email: string; phone: string; pan?: string } | null {
    try {
      return JSON.parse(localStorage.getItem(this.MEMBER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  saveMemberDetails(details: { fname: string; lname: string; email: string; phone: string; pan?: string }) {
    localStorage.setItem(this.MEMBER_KEY, JSON.stringify(details));
    this.memberDetails.set(details);
  }

  login(name: string, phone: string, email?: string) {
    const user: MemberDetails = { name, phone, email: email || '' };
    this.userSignal.set(user);
    this.persist(user);
  }

  logout() {
    this.userSignal.set(null);
    this.persist(null);
  }
}