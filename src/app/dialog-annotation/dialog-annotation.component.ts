import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentViewerService } from '../services/document-viewer.service';

@Component({
  selector: 'app-dialog-annotation',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './dialog-annotation.component.html',
  styleUrl: './dialog-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnnotationComponent {
  readonly dialogRef = inject(MatDialogRef<DialogAnnotationComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly documentViewerService = inject(DocumentViewerService);

  readonly annotationControl = new FormControl<string>('', Validators.required);

  save(): void {
    this.annotationControl.markAllAsTouched();

    if (this.annotationControl.valid) {
      this.dialogRef.close(this.annotationControl.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
