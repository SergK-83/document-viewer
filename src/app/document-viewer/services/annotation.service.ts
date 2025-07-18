import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnnotationComponent } from '../dialog-annotation/dialog-annotation.component';
import { DocumentService } from '@/app/services/document.service';
import {
  Annotation,
  AnnotationPosition,
  DocumentView,
} from '@/app/models/model';

@Injectable()
export class AnnotationService {
  readonly dialog = inject(MatDialog);
  readonly documentService = inject(DocumentService);

  addAnnotation(posTop: number): void {
    const dialogRef = this.dialog.open(DialogAnnotationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newAnnotation: Annotation = {
          id: String(Date.now()),
          text: result,
          position: {
            top: posTop + 20,
            left: 20,
          },
        };

        const callback = (document: DocumentView): DocumentView => {
          const annotations = document.annotations;
          return {
            ...document,
            ...{
              annotations: Array.isArray(annotations)
                ? [...annotations, newAnnotation]
                : [newAnnotation],
            },
          };
        };

        this.documentService.updateDocument(callback);
      }
    });
  }

  removeAnnotation(id: string): void {
    const callback = (document: DocumentView): DocumentView => {
      return {
        ...document,
        ...{ annotations: document.annotations!.filter((a) => a.id !== id) },
      };
    };

    this.documentService.updateDocument(callback);
  }

  updatePosition(id: string, newPosition: AnnotationPosition): void {
    const callback = (document: DocumentView): DocumentView => {
      const annotation = document.annotations!.find((a) => a.id === id);
      annotation!.position = newPosition;

      return { ...document };
    };

    this.documentService.updateDocument(callback);
  }
}
