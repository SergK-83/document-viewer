import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { DocumentViewerService } from '../services/document-viewer.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AnnotationComponent } from './annotation/annotation.component';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilKeyChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-document-viewer',
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    AnnotationComponent,
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly documentViewerService = inject(DocumentViewerService);
  readonly elRef = inject(ElementRef);

  private draggingItem: AnnotationComponent | null = null;
  private readonly dragOffset = { x: 0, y: 0 };

  private scrollTop = 0;
  private scrollLeft = 0;

  @ViewChild('container') containerEl!: ElementRef;

  constructor() {
    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(),
        distinctUntilKeyChanged('id'),
        switchMap(({ id }) =>
          id ? this.documentViewerService.getDocument(id) : of(null),
        ),
      )
      .subscribe();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.draggingItem) {
      const newLeft = event.clientX - this.dragOffset.x;
      const newTop = event.clientY - this.dragOffset.y;

      const minLeft = 0;
      const minTop = 0;
      
      const maxLeft =
        this.containerEl.nativeElement.offsetWidth -
        this.draggingItem.elementRef.nativeElement.offsetWidth;
      const maxTop =
        this.containerEl.nativeElement.offsetHeight -
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

  @HostListener('document:mouseup')
  onMouseUp() {
    this.draggingItem = null;
  }

  @HostListener('scroll')
  onScroll() {
    if (this.draggingItem) {
      const position = this.draggingItem.annotation().position;
      const newScrollTop = this.elRef.nativeElement.scrollTop;
      const newScrollLeft = this.elRef.nativeElement.scrollLeft;
      const scrollTopDiff = newScrollTop - this.scrollTop;
      const scrollLeftDiff = newScrollLeft - this.scrollLeft;

      this.draggingItem.annotation().position.top = position.top + scrollTopDiff;
      this.draggingItem.annotation().position.left =
        position.left + scrollLeftDiff;

      this.scrollTop = newScrollTop;
      this.scrollLeft = newScrollLeft;

      this.dragOffset.x = this.dragOffset.x - scrollLeftDiff;
      this.dragOffset.y = this.dragOffset.y - scrollTopDiff;
    }
  }

  onMouseDown(event: MouseEvent, component: AnnotationComponent): void {
    this.draggingItem = component;
    this.dragOffset.x =
      event.clientX - this.draggingItem.elementRef.nativeElement.offsetLeft;
    this.dragOffset.y =
      event.clientY - this.draggingItem.elementRef.nativeElement.offsetTop;

    this.scrollTop = this.elRef.nativeElement.scrollTop;
    this.scrollLeft = this.elRef.nativeElement.scrollLeft;
  }

  addAnnotation(): void {
    this.documentViewerService.addAnnotation(
      this.elRef.nativeElement.scrollTop,
    );
  }
}
