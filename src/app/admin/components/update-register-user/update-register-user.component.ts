import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../auth/service/auth.service';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-register-user',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './update-register-user.component.html',
  styleUrls: ['./update-register-user.component.scss']
})
export class UpdateRegisterUserComponent {
}
//   constructor(
//     public dialogRef: MatDialogRef<UpdateRegisterUserComponent>,
//     @Inject(MAT_DIALOG_DATA) public user: User
//   ) {}

//   onCancel(): void {
//     this.dialogRef.close(null);
//   }

//   onSave(): void {
//     if (!this.user.fullName.trim() || !this.user.email.trim() || !this.user.password.trim()) return;
//     this.dialogRef.close(this.user);
//   }
// }
