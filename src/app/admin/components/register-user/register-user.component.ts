import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { AuthService, User } from '../../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRegisterUserComponent } from '../update-register-user/update-register-user.component';
import { DeleteRegisterUserComponent } from '../delete-register-user/delete-register-user.component';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  users: User[] = [];
  currentUser: User | null = null;
  readonly dialogs = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.currentUser = this.authService.getCurrentUser();
  }

  loadUsers(): void {
    this.users = this.authService.getUsers();
  }

  isActiveUser(user: User): boolean {
    return this.currentUser?.email === user.email;
  }

  onEdit(user: User): void {
    const dialogRef = this.dialog.open(UpdateRegisterUserComponent, {
      width: '400px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe((result: User | null) => {
      if (result) {
        this.authService.updateUser(result);
        this.toastr.success('User updated successfully!');
        this.loadUsers();
      }
    });
  }

  openDeleteDialog(user: User): void {
    if (this.isActiveUser(user)) {
      this.toastr.error("You cannot delete the currently logged-in user!");
      return;
    }

    const dialogRef = this.dialog.open(DeleteRegisterUserComponent, {
      width: '300px',
      data: { email: user.email }
    });

    dialogRef.afterClosed().subscribe((deleted: boolean) => {
      if (deleted) this.loadUsers();
    });
  }
}
