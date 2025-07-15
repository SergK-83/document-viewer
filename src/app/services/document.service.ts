import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BehaviorSubject,
  catchError,
  delay,
  iif,
  Observable,
  of,
  tap,
} from 'rxjs';
import { DialogAnnotationComponent } from '../document-viewer/dialog-annotation/dialog-annotation.component';
import { MOCK_DATA } from './mock-data';

interface DocumentPage {
  number: number;
  imageUrl: string;
}

export interface Annotation {
  id: string;
  text: string;
  position: {
    top: number;
    left: number;
  };
}

export interface DocumentView {
  name: string;
  pages: DocumentPage[];
  annotations?: Annotation[];
}



@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly _document$ = new BehaviorSubject<DocumentView | null>(null);
  readonly document$ = this._document$.asObservable();

  readonly dialog = inject(MatDialog);

  getDocument(id: string): Observable<DocumentView | null> {
    return iif(() => !!id, of(MOCK_DATA).pipe(delay(500)), of(null)).pipe(
      catchError((err) => {
        console.log('Ошибка: ', err);
        return of(null);
      }),
      tap((document) => {
        this._document$.next(document);
      }),
    );
  }

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

        const document = this._document$.value;

        if (Array.isArray(document?.annotations)) {
          document.annotations.push(newAnnotation);
        } else {
          document!.annotations = [newAnnotation];
        }

        this._document$.next(document);
      }
    });
  }

  removeAnnotation(id: string): void {
    const document = this._document$.value;

    document!.annotations = document!.annotations!.filter((a) => a.id !== id);
    this._document$.next(document);
  }

  save(): void {
    console.log('Документ успешно сохранен!!!', this._document$.value);
  }
}
