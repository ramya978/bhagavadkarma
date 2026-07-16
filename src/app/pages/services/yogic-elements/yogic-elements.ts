import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-yogic-elements',
  imports: [RouterLink],
  templateUrl: './yogic-elements.html',
  styleUrl: './yogic-elements.css',
})
export class YogicElementsComponent {
  activeTab: string = 'meditation';
  expandedSections: { [key: string]: boolean } = {};

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleReadMore(id: string): void {
    this.expandedSections[id] = !this.expandedSections[id];

    if (!this.expandedSections[id]) {
      const article = document.getElementById(`${id}-readmore`);

      if (article) {
        article.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  isExpanded(id: string): boolean {
    return !!this.expandedSections[id];
  }
}