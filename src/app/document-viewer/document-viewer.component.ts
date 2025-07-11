import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { DocumentViewerService } from '../services/document-viewer.service';
import { AsyncPipe, CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AnnotationComponent } from './annotation/annotation.component';

@Component({
  standalone: true,
  selector: 'app-document-viewer',
  imports: [
    CommonModule,
    AsyncPipe,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    AnnotationComponent
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {
  readonly documentViewerService = inject(DocumentViewerService);
  readonly elRef = inject(ElementRef);

  addAnnotation(): void {
    this.documentViewerService.addAnnotation(this.elRef.nativeElement.scrollTop);
  }
}
