import { Annotation } from '@/app/models/model';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnnotationService } from '../services/annotation.service';

@Component({
  standalone: true,
  selector: 'app-annotation',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
  readonly annotationService = inject(AnnotationService);
  readonly elementRef = inject(ElementRef);
  readonly annotation$ = input.required<Annotation>();
}
