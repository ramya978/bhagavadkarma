import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

interface Achievement {
  id: string;
  icon: string;
  color: string;
  target: number;
  max: number;
  label: string;
  currentValue: number;
  strokeDashoffset: number;
}

@Component({
  selector: 'app-our-guru',
  imports: [CommonModule, RouterLink],
  templateUrl: './our-guru.html',
  styleUrl: './our-guru.css',
})
export class OurGuruComponent implements AfterViewInit, OnDestroy {
  @ViewChild('achievementsWrap', { static: true }) achievementsWrap!: ElementRef;

  circumference = 326.7;
  animated = false;
  observer!: IntersectionObserver;
  private rafIds: number[] = [];

  achievements: Achievement[] = [
    {
      id: 'years',
      icon: 'fa-star',
      color: '#1e88e5',
      target: 24,
      max: 24,
      label: 'YEARS OF EXPERIENCE',
      currentValue: 0,
      strokeDashoffset: this.circumference
    },
    {
      id: 'awards',
      icon: 'fa-trophy',
      color: '#f4511e',
      target: 4,
      max: 4,
      label: 'AWARDS WON',
      currentValue: 0,
      strokeDashoffset: this.circumference
    },
    {
      id: 'hours',
      icon: 'fa-clock',
      color: '#9ccc00',
      target: 80300,
      max: 80300,
      label: 'HOURS WORKED',
      currentValue: 0,
      strokeDashoffset: this.circumference
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Fallback in case IntersectionObserver never fires (already-visible element etc.)
    const fallback = setTimeout(() => {
      this.startAnimation();
    }, 500);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(fallback);
            this.startAnimation();
            this.observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(this.achievementsWrap.nativeElement);
  }

  private startAnimation(): void {
    if (this.animated) {
      return;
    }
    this.animated = true;

    this.achievements.forEach((item) => {
      this.animateRing(item);
    });
  }

  private animateRing(item: Achievement): void {
    const duration = 2000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(eased * item.target);
      const currentPercent = eased * (item.target / item.max);
      const offset = this.circumference - currentPercent * this.circumference;

      item.currentValue = currentValue;
      item.strokeDashoffset = offset;

      // Manually trigger change detection so the view actually updates
      this.cdr.detectChanges();

      if (progress < 1) {
        const id = requestAnimationFrame(update);
        this.rafIds.push(id);
      } else {
        item.currentValue = item.target;
        item.strokeDashoffset =
          this.circumference - (item.target / item.max) * this.circumference;
        this.cdr.detectChanges();
      }
    };

    const id = requestAnimationFrame(update);
    this.rafIds.push(id);
  }

  formatValue(value: number): string {
    return value.toLocaleString();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.rafIds.forEach((id) => cancelAnimationFrame(id));
  }
}