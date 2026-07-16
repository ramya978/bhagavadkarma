import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-little-diamond',
  imports: [RouterLink],
  templateUrl: './little-diamond.html',
  styleUrl: './little-diamond.css',
})
export class LittleDiamondComponent {
  
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
