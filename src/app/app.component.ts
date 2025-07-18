import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeaderComponent } from './main-header/main-header.component';
import {
  AppLoaderDirective,
  LOADER_WIDTH_DEFAULT,
  LoaderConfig,
} from './directives/loader.directive';
import { PageLoaderService } from './services/page-loader.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MainHeaderComponent, AppLoaderDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly loaderConfig: LoaderConfig = {
    backdrop: 'rgba(0, 0, 0, 0.32)',
    loaderSize: LOADER_WIDTH_DEFAULT,
  };

  readonly pageLoaderService = inject(PageLoaderService);
}
