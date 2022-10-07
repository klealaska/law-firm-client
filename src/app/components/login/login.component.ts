import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  userRoles = new Array();

  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private storageService: StorageService,
    private route: Router
  ) { }

  ngOnInit(): void { }

  onLogin() {
    const data = {
      email: this.email,
      password: this.password,
    };
    if (data.password.length > 0 || data.email.length > 0) {
      this.userService.postLogin(data).subscribe((res: any) => {
        res.userResponse.roles.forEach(role => {
          this.userRoles.push(role.name);
        });
        if (this.userRoles.includes(this.userService.userSystemRoles[0])) {
          if (res.token === '') {
            this.toast.error('Unauthorized!');
          }
          this.storageService.setAuthToken(res.token);
          this.route.navigate(['']);
        } else {
          this.toast.warning('You don\'t have permission to login!');
        }
      },
        (error) => {
          if (error.status === 403) {
            this.toast.error('You cannot login! Please verify your account first!');
          } else if (error.status === 400) {
            this.toast.error('Invalid Email or Password!');
          } else {
            this.toast.error('Something went wrong! Try again later!');
          }
        }
      );
    } else {
      this.toast.error('Not valid! Please fill out the fields!');
    }
  }
}
