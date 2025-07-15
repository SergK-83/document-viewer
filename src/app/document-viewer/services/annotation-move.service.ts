import { ElementRef, inject, Injectable } from '@angular/core';
import { AnnotationComponent } from '../annotation/annotation.component';
import { ZoomService } from '@/app/services/zoom.service';

@Injectable()
export class AnnotationMoveService {
  private draggingItem: AnnotationComponent | null = null;
  private readonly dragOffset = { x: 0, y: 0 };
  private scrollTop = 0;
  private scrollLeft = 0;

  readonly zoomService = inject(ZoomService);
  

  onMouseDown(event: MouseEvent, component: AnnotationComponent, scrollContainerEl: ElementRef): void {
    const zoomLevel = this.zoomService.zoomLevel();

    this.draggingItem = component;
    this.dragOffset.x =
      event.clientX / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetLeft;
    this.dragOffset.y =
      event.clientY / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetTop;

    this.scrollTop = scrollContainerEl.nativeElement.scrollTop / zoomLevel;
    this.scrollLeft = scrollContainerEl.nativeElement.scrollLeft / zoomLevel;
  }

  onMouseMove(event: MouseEvent, documentContainerEl: ElementRef): void {
    if (this.draggingItem) {
      const zoomLevel = this.zoomService.zoomLevel();
      const newLeft = event.clientX / zoomLevel - this.dragOffset.x;
      const newTop = event.clientY / zoomLevel - this.dragOffset.y;

      const minLeft = 0;
      const minTop = 0;

      const maxLeft =
        documentContainerEl.nativeElement.offsetWidth -
        this.draggingItem.elementRef.nativeElement.offsetWidth;
      const maxTop =
        documentContainerEl.nativeElement.offsetHeight -
        this.draggingItem.elementRef.nativeElement.offsetHeight;

      this.draggingItem.annotation().position.left = Math.max(
        minLeft,
        Math.min(maxLeft, newLeft),
      );
      this.draggingItem.annotation().position.top = Math.max(
        minTop,
        Math.min(maxTop, newTop),
      );
    }
  }

  onScroll(scrollContainerEl: ElementRef, documentContainerEl: ElementRef) {
    if (this.draggingItem) {
      const position = this.draggingItem.annotation().position;
      const zoomLevel = this.zoomService.zoomLevel();

      const newScrollTop = scrollContainerEl.nativeElement.scrollTop / zoomLevel;
      const newScrollLeft = scrollContainerEl.nativeElement.scrollLeft / zoomLevel;
      const scrollTopDiff = newScrollTop - this.scrollTop;
      const scrollLeftDiff = newScrollLeft - this.scrollLeft;

      const minLeft = 0;
      const minTop = 0;
      const newLeft = position.left + scrollLeftDiff;
      const newTop = position.top + scrollTopDiff;

      const maxLeft =
        documentContainerEl.nativeElement.offsetWidth -
        this.draggingItem.elementRef.nativeElement.offsetWidth;
      const maxTop =
        documentContainerEl.nativeElement.offsetHeight -
        this.draggingItem.elementRef.nativeElement.offsetHeight;

      this.draggingItem.annotation().position.left = Math.max(
        minLeft,
        Math.min(maxLeft, newLeft),
      );
      this.draggingItem.annotation().position.top = Math.max(
        minTop,
        Math.min(maxTop, newTop),
      );

      this.scrollTop = newScrollTop;
      this.scrollLeft = newScrollLeft;

      this.dragOffset.x = this.dragOffset.x - scrollLeftDiff;
      this.dragOffset.y = this.dragOffset.y - scrollTopDiff;
    }
  }

  onMouseUp() {
    this.draggingItem = null;
  }
}
