import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { IUser } from 'src/app/interfaces/mazars.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent implements OnInit {
  public email = '';
  public oldPassword = '';
  public newPassword = '';
  public confirmPassword = '';
  isValid = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    public userService: UserService,
    public toast: ToastrService) { }

  ngOnInit() {
    this.getUserEmail();
  }

  getUserEmail() {
    this.userService.getProfile().subscribe((res: IUser) => {
      this.email = res.email;
    });
  }
  validatePassword(password) {
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9]).{5,}$');
    const valid = regex.test(password);
    if (!valid) {
      this.isValid = false;
      this.toast.warning(
        'Password must have 6 alphanumeric characters, such as: "A,a,@,1"'
      );
    }
  }

  changePassword() {
    this.isValid = true;
    const data = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
    if (this.newPassword.length > 0) {
      this.validatePassword(this.newPassword);
    }
    if (this.confirmPassword.length >= 0 && this.confirmPassword !== this.newPassword) {
      this.isValid = false;
      this.toast.warning('Passwords don\'t match!');
    }
    if (this.isValid) {
      this.userService.postReset(data).subscribe((res: any) => {
        this.toast.success('Password updated successfully!');
        this.closeModal();
      }, error => {
        this.toast.warning('Error! Cannot change, try again later.');
        this.closeModal();

      });
    }

  }

  closeModal() {
    this.dialogRef.close();
  }

}
