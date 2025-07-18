import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

export interface LoaderConfig {
    loaderSize?: number;
    backdrop?: string;
}

export const LOADER_WIDTH_DEFAULT = 107;
export const LOADER_WIDTH_SM = 50;
export const LOADER_WIDTH_XS = 25;
const BACKDROP_BACKGROUND_DEFAULT = 'rgba(255,255,255, 0.9)';

@Directive({
    standalone: true,
    selector: '[appLoader]',
})
export class AppLoaderDirective implements OnInit, OnDestroy {
    private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly isLoaderActive$ = new BehaviorSubject<boolean>(false);
    private readonly destroy$ = new Subject<void>();

    @Input({ alias: 'appLoader', required: true }) set isLoaderActive(value: boolean | null) {
        this.isLoaderActive$.next(value || false);
    }

    @Input() loaderConfig: LoaderConfig | null = null;

    ngOnInit(): void {
        const el = this.elRef.nativeElement;

        if (getComputedStyle(el).position === 'static') {
            this.renderer.setStyle(el, 'position', 'relative');
        }

        const backdropEl = this.renderer.createElement('div');
        this.renderer.addClass(backdropEl, 'app-loader-backdrop');

        this.renderer.setStyle(
            backdropEl,
            'background-color',
            `${this.loaderConfig?.backdrop || BACKDROP_BACKGROUND_DEFAULT}`
        );

        const wrapEl = this.renderer.createElement('div');
        this.renderer.addClass(wrapEl, 'app-loader-wrap');

        const loaderEl = this.renderer.createElement('div');
        this.renderer.setStyle(loaderEl, 'width', `${this.loaderConfig?.loaderSize || LOADER_WIDTH_SM}px`);
        this.renderer.setStyle(loaderEl, 'height', `${this.loaderConfig?.loaderSize || LOADER_WIDTH_SM}px`);
        this.renderer.addClass(loaderEl, 'app-loader');

        this.renderer.appendChild(backdropEl, wrapEl);
        this.renderer.appendChild(wrapEl, loaderEl);

        this.isLoaderActive$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
            if (value) {
                this.renderer.appendChild(el, backdropEl);
            } else if (el.contains(backdropEl)) {
                this.renderer.removeChild(el, backdropEl);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
