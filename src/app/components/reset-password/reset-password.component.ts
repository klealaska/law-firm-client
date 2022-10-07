import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  oldPassword = '';
  newPassword = '';
  isValid = true;

  constructor(
    private userService: UserService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void { }

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

  resetPassword() {
    const data = {
      email: this.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
    if (this.newPassword.length > 0) {
      this.validatePassword(this.newPassword);
    }
    if (this.isValid) {
      this.userService.postReset(data).subscribe(() => {
        this.toast.success('Password updated successfully!');
      }, error => {
        this.toast.warning('Error! Cannot reset, please try again.');

      });
    }
  }
}
