import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentViewerService } from '../services/document-viewer.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-main-header',
  imports: [AsyncPipe, MatButtonModule, MatIconModule],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent {
  readonly documentViewerService = inject(DocumentViewerService);
}
