import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inner-hush',
  imports: [RouterLink],
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