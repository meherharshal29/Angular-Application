import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-popup',
  imports: [MaterialModule],
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.scss'
})
export class DialogPopupComponent {
constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
