import {
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  delay,
  distinctUntilKeyChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { DialogAnnotationComponent } from '../dialog-annotation/dialog-annotation.component';

interface DocumentPage {
  number: number;
  imageUrl: string;
}

export interface Annotation {
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

const data: DocumentView = {
  name: 'test doc',
  pages: [
    {
      number: 1,
      imageUrl: 'assets/pages/1.png',
    },
    {
      number: 2,
      imageUrl: 'assets/pages/2.png',
    },
    {
      number: 3,
      imageUrl: 'assets/pages/3.png',
    },
    {
      number: 4,
      imageUrl: 'assets/pages/4.png',
    },
    {
      number: 5,
      imageUrl: 'assets/pages/5.png',
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class DocumentViewerService {
  private readonly _document$ = new BehaviorSubject<DocumentView | null>(null);
  readonly document$ = this._document$.asObservable();

  readonly dialog = inject(MatDialog);

  readonly zoomLevel = signal(1);
  private readonly minZoom = 0.6;
  private readonly maxZoom = 2;
  private readonly zoomStep = 0.1;

  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.queryParams
      .pipe(
        distinctUntilKeyChanged('id'),
        switchMap(({ id }) => (id ? this.getDocument(id) : of(null))),
      )
      .subscribe((document) => {
        this._document$.next(document);
      });
  }

  zoomIn(): void {
    const currentZoomLevel = this.zoomLevel();

    if (currentZoomLevel < this.maxZoom) {
      this.zoomLevel.set(currentZoomLevel + this.zoomStep);
    }
  }

  zoomOut(): void {
    const currentZoomLevel = this.zoomLevel();

    if (currentZoomLevel > this.minZoom) {
      this.zoomLevel.set(currentZoomLevel - this.zoomStep);
    }
  }

  getZoomValue(): string {
    return `${(this.zoomLevel() * 100).toFixed()}%`;
  }

  addAnnotation(posTop: number): void {
    const dialogRef = this.dialog.open(DialogAnnotationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newAnnotation: Annotation = {
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

  private getDocument(id: string): Observable<DocumentView> {
    console.log('getDocument() id', id);

    return of(data).pipe(delay(500));
  }
}
