import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PageLoaderService {
    private readonly _loaderActive$ = signal<boolean>(false);
    readonly loaderActive$ = this._loaderActive$.asReadonly();

    show() {
        this._loaderActive$.set(true);
    }

    hide() {
        this._loaderActive$.set(false);
    }
}
