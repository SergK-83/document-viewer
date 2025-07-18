import { DestroyRef, ElementRef, inject, Injectable } from '@angular/core';
import { AnnotationComponent } from '../annotation/annotation.component';
import { ZoomService } from '@/app/services/zoom.service';
import {
  fromEvent,
  map,
  merge,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnnotationService } from './annotation.service';
import { AnnotationPosition } from '@/app/models/model';

export interface AnnotationMoveData {
  event: MouseEvent;
  component: AnnotationComponent;
}

@Injectable()
export class AnnotationMoveService {
  private draggingItem: AnnotationComponent | null = null;

  private scrollContainerEl!: HTMLElement;
  private documentContainerEl!: HTMLElement;

  private scrollTop = 0;
  private scrollLeft = 0;
  private readonly minLeft = 0;
  private readonly minTop = 0;
  private readonly dragOffset = { x: 0, y: 0 };

  private readonly zoomService = inject(ZoomService);
  private readonly annotationService = inject(AnnotationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly startMoveAnnotation$ = new Subject<void>();

  initMoveData(
    scrollContainer: ElementRef,
    documentContainer: ElementRef,
  ): void {
    this.scrollContainerEl = scrollContainer.nativeElement;
    this.documentContainerEl = documentContainer.nativeElement;

    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
    const scroll$ = fromEvent<MouseEvent>(this.scrollContainerEl, 'scroll');

    this.startMoveAnnotation$
      .pipe(
        switchMap(() => {
          return merge(mousemove$, scroll$).pipe(
            map((mouseEvent) => {
              return mouseEvent.type === 'mousemove'
                ? this.onMouseMove(mouseEvent)
                : this.onScroll();
            }),
            takeUntil(
              mouseup$.pipe(
                tap(() => {
                  this.draggingItem = null;
                }),
              ),
            ),
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

  onMouseDown(moveData: AnnotationMoveData): void {
    const zoomLevel = this.zoomService.zoomLevel$();

    this.draggingItem = moveData.component;
    this.dragOffset.x =
      moveData.event.clientX / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetLeft;
    this.dragOffset.y =
      moveData.event.clientY / zoomLevel -
      this.draggingItem.elementRef.nativeElement.offsetTop;

    this.scrollTop = this.scrollContainerEl.scrollTop / zoomLevel;
    this.scrollLeft = this.scrollContainerEl.scrollLeft / zoomLevel;

    this.startMoveAnnotation$.next();
  }

  onMouseMove(event: MouseEvent): AnnotationPosition | null {
    let newPosition: AnnotationPosition | null = null;

    if (this.draggingItem) {
      const zoomLevel = this.zoomService.zoomLevel$();
      const newLeft = event.clientX / zoomLevel - this.dragOffset.x;
      const newTop = event.clientY / zoomLevel - this.dragOffset.y;

      newPosition = this.getNewPosition(newLeft, newTop);
    }

    return newPosition;
  }

  onScroll(): AnnotationPosition | null {
    let newPosition: AnnotationPosition | null = null;

    if (this.draggingItem) {
      const position = this.draggingItem.annotation$().position;
      const zoomLevel = this.zoomService.zoomLevel$();

      const newScrollTop = this.scrollContainerEl.scrollTop / zoomLevel;
      const newScrollLeft = this.scrollContainerEl.scrollLeft / zoomLevel;

      const scrollTopDiff = newScrollTop - this.scrollTop;
      const scrollLeftDiff = newScrollLeft - this.scrollLeft;

      const newLeft = position.left + scrollLeftDiff;
      const newTop = position.top + scrollTopDiff;

      newPosition = this.getNewPosition(newLeft, newTop);

      this.scrollTop = newScrollTop;
      this.scrollLeft = newScrollLeft;

      this.dragOffset.x = this.dragOffset.x - scrollLeftDiff;
      this.dragOffset.y = this.dragOffset.y - scrollTopDiff;
    }

    return newPosition;
  }

  private getNewPosition(
    newLeft: number,
    newTop: number,
  ): AnnotationPosition {
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
