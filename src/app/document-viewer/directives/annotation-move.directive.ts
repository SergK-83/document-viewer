import { DestroyRef, Directive, inject, Input, OnInit } from '@angular/core';
import { AnnotationComponent } from '../annotation/annotation.component';
import { ZoomService } from '@/app/services/zoom.service';
import { AnnotationService } from '../services/annotation.service';
import { fromEvent, map, merge, switchMap, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnnotationPosition } from '@/app/models/model';

@Directive({
  standalone: true,
  selector: '[appAnnotationMove]',
})
export class AnnotationMoveDirective implements OnInit {
  private scrollTop = 0;
  private scrollLeft = 0;
  private readonly minLeft = 0;
  private readonly minTop = 0;
  private readonly dragOffset = { x: 0, y: 0 };

  private readonly zoomService = inject(ZoomService);
  private readonly annotationService = inject(AnnotationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly draggingItem = inject(AnnotationComponent);

  @Input({ required: true }) scrollContainerEl!: HTMLElement;
  @Input({ required: true }) documentContainerEl!: HTMLElement;

  ngOnInit(): void {
    const mousedown$ = fromEvent<MouseEvent>(this.draggingItem.elementRef.nativeElement, 'mousedown');
    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
    const scroll$ = fromEvent<MouseEvent>(this.scrollContainerEl, 'scroll');

    mousedown$
      .pipe(
        switchMap((mouseDownEvent) => {
          this.onMouseDown(mouseDownEvent);

          return merge(mousemove$, scroll$).pipe(
            map((mouseEvent) => {
              return mouseEvent.type === 'mousemove'
                ? this.onMouseMove(mouseEvent)
                : this.onScroll();
            }),
            takeUntil(mouseup$),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((position) => {
        if (position && this.draggingItem) {
          this.annotationService.updatePosition(
            this.draggingItem.annotation$().id,
            position,
          );
        }
      });
  }

  onMouseDown(event: MouseEvent): void {
    const zoomLevel = this.zoomService.zoomLevel$();

    this.dragOffset.x =
      event.clientX / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetLeft;
    this.dragOffset.y =
      event.clientY / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetTop;

    this.scrollTop = this.scrollContainerEl.scrollTop / zoomLevel;
    this.scrollLeft = this.scrollContainerEl.scrollLeft / zoomLevel;
  }

  onMouseMove(event: MouseEvent): AnnotationPosition | null {
    const zoomLevel = this.zoomService.zoomLevel$();
    const newLeft = event.clientX / zoomLevel - this.dragOffset.x;
    const newTop = event.clientY / zoomLevel - this.dragOffset.y;

    return this.getNewPosition(newLeft, newTop);
  }

  onScroll(): AnnotationPosition {
    const position = this.draggingItem.annotation$().position;
    const zoomLevel = this.zoomService.zoomLevel$();

    const newScrollTop = this.scrollContainerEl.scrollTop / zoomLevel;
    const newScrollLeft = this.scrollContainerEl.scrollLeft / zoomLevel;

    const scrollTopDiff = newScrollTop - this.scrollTop;
    const scrollLeftDiff = newScrollLeft - this.scrollLeft;

    const newLeft = position.left + scrollLeftDiff;
    const newTop = position.top + scrollTopDiff;

    this.scrollTop = newScrollTop;
    this.scrollLeft = newScrollLeft;

    this.dragOffset.x = this.dragOffset.x - scrollLeftDiff;
    this.dragOffset.y = this.dragOffset.y - scrollTopDiff;

    return this.getNewPosition(newLeft, newTop);
  }

  private getNewPosition(newLeft: number, newTop: number): AnnotationPosition {
    const maxLeft =
      this.documentContainerEl.offsetWidth -
      this.draggingItem!.elementRef.nativeElement.offsetWidth;
    const maxTop =
      this.documentContainerEl.offsetHeight -
      this.draggingItem!.elementRef.nativeElement.offsetHeight;

    return {
      left: Math.max(this.minLeft, Math.min(maxLeft, newLeft)),
      top: Math.max(this.minTop, Math.min(maxTop, newTop)),
    };
  }
}
