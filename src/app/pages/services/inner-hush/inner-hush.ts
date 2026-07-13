import { Component } from '@angular/core';

@Component({
  selector: 'app-inner-hush',
  imports: [],
  templateUrl: './inner-hush.html',
  styleUrl: './inner-hush.css',
})
export class InnerHushComponent {
  accordionStates: { [key: number]: boolean } = {};

  toggleAccordion(id: number): void {
    this.accordionStates[id] = !this.accordionStates[id];
  }

  isAccordionOpen(id: number): boolean {
    return !!this.accordionStates[id];
  }
}