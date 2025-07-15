import {
  Annotation,
  DocumentService,
} from '@/app/services/document.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-annotation',
  imports: [ MatButtonModule, MatIconModule],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
  readonly documentService = inject(DocumentService);
  readonly elementRef = inject(ElementRef);
  readonly annotation = input.required<Annotation>()
}
