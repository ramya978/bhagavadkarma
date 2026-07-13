import { Component } from '@angular/core';

@Component({
  selector: 'app-vedic-food',
  imports: [],
  templateUrl: './vedic-food.html',
  styleUrl: './vedic-food.css',
})
export class VedicFoodComponent {
  expandedSections: { [key: number]: boolean } = {};

  toggleReadMore(id: number): void {
    this.expandedSections[id] = !this.expandedSections[id];

    if (!this.expandedSections[id]) {
      const article = document.getElementById(`readmore${id}`);

      if (article) {
        article.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  isExpanded(id: number): boolean {
    return !!this.expandedSections[id];
  }
}