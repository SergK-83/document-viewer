import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ZoomService } from '../services/zoom.service';

@Component({
  standalone: true,
  selector: 'app-main-header',
  imports: [ MatButtonModule, MatIconModule],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent {
  readonly documentService = inject(DocumentService);
  readonly zoomService = inject(ZoomService);
}
