import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-monk',
  imports: [RouterLink],
  templateUrl: './monk.html',
  styleUrl: './monk.css',
})
export class MonkComponent implements OnInit {
  isActForGoodRoute = false;
  isFeedAMonkRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const url = this.router.url;
    this.isActForGoodRoute = url.includes('/act-for-good');
    this.isFeedAMonkRoute = url.includes('/feed-a-monk');
  }
}
