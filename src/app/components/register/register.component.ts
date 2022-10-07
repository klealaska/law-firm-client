import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/interfaces/mazars.model';
import { ConfirmEmailPopupComponent } from 'src/app/modals/confirm-email-popup/confirm-email-popup.component';
import { RegisterService } from 'src/app/services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public user: IUser = {} as IUser;
  public userGroups = new Array();
  public userCategories = new Array();
  public userRoleIds = [11];
  isValid = true;
  userCategoryId;
  userGroupId;
  firstName;
  lastName;
  email;
  company;
  password;
  confirmPassword;

  source = [
    { id: 1, name: 'LinkedIn' },
    { id: 2, name: 'Word of mouth' },
    { id: 3, name: 'Events' },
    { id: 4, name: 'Publications' },
    { id: 5, name: 'Others' },
  ];

  constructor(
    private registerService: RegisterService,
    public matDialog: MatDialog,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getUserGroups();
    this.getUserCategories();
  }
  getUserGroups() {
    this.registerService.getUserGroups().subscribe((result: any) => {
      this.userGroups = result.body;
    });
  }

  getUserCategories() {
    this.registerService.getUserCategories().subscribe((result: any) => {
      this.userCategories = result.body;
    });
  }

  onSubmit() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      email: this.user.email,
      password: this.user.password,
      userGroupId: this.userGroupId,
      userCategoryId: this.userCategoryId,
      userRoleIds: this.userRoleIds,
    };
    if (this.user.password.length > 0) {
      this.validatePassword(this.user.password);
    }
    if (this.isValid) {
      this.spinner.show();
      this.registerService.postRegister(data).subscribe(

        () => {
          this.spinner.hide();
          this.openModal();
        },
        (error) => {
          if (error.status === 403) {
            this.spinner.hide();
            this.toast.error('Email already exists ! Try another email!');

          } else {
            this.spinner.hide();
            this.toast.error('Error! Something went wrong, try again later.');

          }
        }
      );
    }
  }

  validatePassword(password) {
    const regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.{5,})");
    const valid = regex.test(password);
    if (!valid) {
      this.isValid = false;
      this.toast.warning('Invalid password');
    }
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '168px';
    dialogConfig.width = '374px';
    const modalDialog = this.matDialog.open(
      ConfirmEmailPopupComponent,
      dialogConfig
    );
  }
}
