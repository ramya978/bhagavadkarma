import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-environment',
  imports: [RouterLink],
  templateUrl: './environment.html',
  styleUrl: './environment.css',
})
export class EnvironmentComponent {}
