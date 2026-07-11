import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wisdom',
  imports: [],
  templateUrl: './wisdom.html',
  styleUrl: './wisdom.css',
})
export class WisdomComponent implements AfterViewInit , OnDestroy {

  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.playVideo();
    }, 100);
  }

  playVideo() {
    const video = this.bgVideo.nativeElement;
    video.muted = true;
    video.volume = 0;
    video.load(); // ← Key fix: reload pannitu play pann
    
    video.play().catch(err => {
      console.warn('Autoplay blocked:', err);
      document.addEventListener('click', () => {
        video.muted = true;
        video.play();
      }, { once: true });
    });
  }

  ngOnDestroy() {
    if (this.bgVideo) {
      const video = this.bgVideo.nativeElement;
      video.pause();
      video.src = '';
      video.load();
    }
  }
}