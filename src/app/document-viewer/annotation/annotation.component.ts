import { Annotation } from '@/app/services/document-viewer.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-annotation',
  imports: [CommonModule],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
  @Input({ required: true }) annotation!: Annotation;
  @Input({ required: true }) container!: ElementRef;

  @ViewChild('draggableElement') draggable!: ElementRef;

  isDragging = false;
  offset = { x: 0, y: 0 };

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.offset.x = event.clientX - this.draggable.nativeElement.offsetLeft;
    this.offset.y = event.clientY - this.draggable.nativeElement.offsetTop;
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const newX = event.clientX - this.offset.x;
      const newY = event.clientY - this.offset.y;
      const containerRect =
        this.container.nativeElement.getBoundingClientRect();

      this.annotation.position.left = newX - containerRect.left;
      this.annotation.position.left = newX;
      this.annotation.position.top = newY;
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }
}
