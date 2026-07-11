import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sitemap.html',
  styleUrl: './sitemap.css',
})
export class SitemapComponent {}