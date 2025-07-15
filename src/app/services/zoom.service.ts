import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ZoomService {
  readonly zoomLevel = signal(1);
  private readonly minZoom = 0.6;
  private readonly maxZoom = 2;
  private readonly zoomStep = 0.1;

  zoomIn(): void {
    const currentZoomLevel = this.zoomLevel();

    if (currentZoomLevel < this.maxZoom) {
      this.zoomLevel.set(currentZoomLevel + this.zoomStep);
    }
  }

  zoomOut(): void {
    const currentZoomLevel = this.zoomLevel();

    if (currentZoomLevel > this.minZoom) {
      this.zoomLevel.set(currentZoomLevel - this.zoomStep);
    }
  }

  getZoomValue(): string {
    return `${(this.zoomLevel() * 100).toFixed()}%`;
  }
}
