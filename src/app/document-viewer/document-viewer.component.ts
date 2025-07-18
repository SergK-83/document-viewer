import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { DocumentService } from '../services/document.service';
import { NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AnnotationComponent } from './annotation/annotation.component';
import { ActivatedRoute } from '@angular/router';
import {
  distinctUntilKeyChanged,
  of,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZoomService } from '../services/zoom.service';
import {
  AnnotationMoveService,
} from './services/annotation-move.service';
import { AnnotationService } from './services/annotation.service';
import { AnnotationMoveDirective } from './directives/annotation-move.directive';

@Component({
  standalone: true,
  selector: 'app-document-viewer',
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    AnnotationComponent,
    AnnotationMoveDirective
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnnotationMoveService, AnnotationService],
})
export class DocumentViewerComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly documentService = inject(DocumentService);
  readonly zoomService = inject(ZoomService);
  private readonly annotationService = inject(AnnotationService);
  readonly annotationMoveService = inject(AnnotationMoveService);
  readonly scrollContainer = inject(ElementRef);

  @ViewChild('documentContainer') documentContainer!: ElementRef;

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

  ngAfterViewInit(): void {
    this.annotationMoveService.initMoveData(this.scrollContainer, this.documentContainer)

  }

  addAnnotation(): void {
    this.annotationService.addAnnotation(
      this.scrollContainer.nativeElement.scrollTop,
    );
  }
}
