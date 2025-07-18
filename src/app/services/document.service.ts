import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, iif, Observable, of, tap } from 'rxjs';
import { MOCK_DATA } from './mock-data';
import { DocumentView } from '../models/model';
import { PageLoaderService } from './page-loader.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly _document$ = signal<DocumentView | null>(null);
  readonly document$ = this._document$.asReadonly();

  readonly pageLoaderService = inject(PageLoaderService);

  getDocument(id: string): Observable<DocumentView | null> {
    this.pageLoaderService.show();

    return iif(() => !!id, of(MOCK_DATA).pipe(delay(1000)), of(null)).pipe(
      catchError((err) => {
        console.log('Ошибка: ', err);
        return of(null);
      }),
      tap((document) => {
        this._document$.set(document);
        this.pageLoaderService.hide();
      }),
    );
  }

  save(): void {
    console.log('Документ успешно сохранен!!!', this._document$());
  }

  updateDocument(cb: (value: DocumentView) => DocumentView): void {
    this._document$.update((document) => {
      if (!document) {
        throw new Error('document not defined');
      }

      return cb(document);
    });
  }
}
