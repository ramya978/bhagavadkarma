import { Component } from '@angular/core';

@Component({
  selector: 'app-aura-mechanism',
  imports: [],
  templateUrl: './aura-mechanism.html',
  styleUrl: './aura-mechanism.css',
})
export class AuraMechanismComponent {
  
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
