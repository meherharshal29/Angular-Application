import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../../../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/materials/material/material.module';

@Component({
  selector: 'app-delete-register-user',
  standalone: true,
  imports: [MatButtonModule, CommonModule,MaterialModule],
  templateUrl:'./delete-register-user.component.html',
  styleUrls: ['./delete-register-user.component.scss']
})
export class DeleteRegisterUserComponent {

  users: User[] = [];
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DeleteRegisterUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) 
  {
    // this.users = this.authService.getUsers();
    this.currentUser = this.authService.getCurrentUser();
  }

  // confirmDelete(): void {
  //   if (this.currentUser?.email === this.data.email) {
  //     this.toastr.error("You cannot delete the currently logged-in user!");
  //     this.dialogRef.close(false);
  //     return;
  //   }

  //   const updatedUsers = this.users.filter(u => u.email !== this.data.email);
  //   localStorage.setItem('users', JSON.stringify(updatedUsers));
  //   this.toastr.warning('User deleted successfully!');
  //   this.dialogRef.close(true); 
  // }

  // cancel(): void {
  //   this.dialogRef.close(false);
  // }
}
