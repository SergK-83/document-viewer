import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { DocumentService } from '../services/document.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AnnotationComponent } from './annotation/annotation.component';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilKeyChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZoomService } from '../services/zoom.service';
import { AnnotationMoveService } from './services/annotation-move.service';

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
  providers: [AnnotationMoveService],
})
export class DocumentViewerComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly documentService = inject(DocumentService);
  readonly zoomService = inject(ZoomService);
  readonly annotationMoveService = inject(AnnotationMoveService);
  readonly scrollContainerEl = inject(ElementRef);

  @ViewChild('documentContainer') documentContainerEl!: ElementRef;

  constructor() {
    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(),
        distinctUntilKeyChanged('id'),
        switchMap(({ id }) =>
          id ? this.documentService.getDocument(id) : of(null),
        ),
      )
      .subscribe();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.annotationMoveService.onMouseMove(event, this.documentContainerEl);
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.annotationMoveService.onMouseUp();
  }

  @HostListener('scroll')
  onScroll() {
    this.annotationMoveService.onScroll(
      this.scrollContainerEl,
      this.documentContainerEl,
    );
  }

  addAnnotation(): void {
    this.documentService.addAnnotation(
      this.scrollContainerEl.nativeElement.scrollTop,
    );
  }
}
