import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'src/app/interfaces/mazars.model';
import { ChangePasswordPopupComponent } from 'src/app/modals/change-password-popup/change-password-popup/change-password-popup.component';
import { RegisterService } from 'src/app/services/register/register.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user: IUser = {} as IUser;
  public userGroups = new Array();
  public userCategories = new Array();
  public userRoleIds = [11];
  imagePath;
  userId;
  userCategoryName;
  userGroupName;
  userCategoryId;
  userGroupId;
  @ViewChild('fileInput', { static: false }) el: ElementRef;

  editFile: boolean = true;
  removeUpload: boolean = false;
  file: [null];
  isValid = true;
  blackList = [null, 'null', undefined, ''];
  firstName: any;
  lastName: any;
  email: any;
  company: any;
  notificationRules: any;
  preferedLanguage: any;
  generalToggle;
  importantToggle;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    public matDialog: MatDialog,
    private registerService: RegisterService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.getUserGroups();
    this.getUserCategories();
    this.getUserData();
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

  getUserData() {
    this.userService.getProfile().subscribe((res: any) => {
      this.userId = res.id;
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.email = res.email;
      this.company = this.blackList.includes(res.company) ? '' : res.company;
      this.userCategoryId = res.userCategoryId;
      this.userGroupId = res.userGroupId;
      this.userCategoryName = res.userCategoryName;
      this.userGroupName = res.userGroupName;
      this.notificationRules = res.notificationRules;
      this.generalToggle = this.notificationRules['GENERAL'];
      this.importantToggle = this.notificationRules['IMPORTANT_TAX_DATE'];
      this.preferedLanguage = res.preferredLanguage;
      if (res.imagePath != null) {
        this.imagePath = res.imagePath.split('\\').join('/');
      }
    }, (error) => {
      error.status == 400
        ? this.toast.warning(error.error)
        : this.toast.error('Something went wrong');
    });
  }

  uploadFile(event) {
    const reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file
      reader.onload = () => {
        this.imagePath = reader.result;
        file = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  editProfile() {
    this.isValid = true;
    const dataToUpdate = {
      id: this.userId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      userCategoryId: this.userCategoryId,
      userGroupId: this.userGroupId,
      userRoleIds: this.userRoleIds
    };
    if (this.isValid) {
      this.userService.updateProfile(dataToUpdate).subscribe(() => {
        this.toast.success('Updated successfully!');
      }, error => {
        this.toast.warning('Error! Cannot edit, try again later.');
      });
    }
  }

  uploadImage() {
    const dataToUpdate = {
      id: this.userId,
      imageContent: this.imagePath != null ? this.imagePath.split(',')[1] : null
    };
    this.userService.updateUserProfileImage(dataToUpdate).subscribe(() => {
      this.userService.sendNotification(this.imagePath);
      this.toast.success('Profile image updated successfully');
    }, () => {
      this.toast.error('Something went wrong, try again later');
    });
  }

  removeImage() {
    const dataToUpdate = {
      id: this.userId,
      imageContent: null
    };
    this.userService.updateUserProfileImage(dataToUpdate).subscribe(() => {
      this.imagePath = null;
      this.userService.sendNotification(this.imagePath);
      this.toast.success('Profile image removed successfully');
    }, () => {
      this.toast.error('Something went wrong, try again later');
    });
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '315px';
    dialogConfig.width = '520px';
    const modalDialog = this.matDialog.open(
      ChangePasswordPopupComponent,
      dialogConfig
    );
  }

  async notificationSliderChanged(type) {
    await this.userService.updateNotificationRules(type).toPromise();
  }

  async setPreferedLanguage(language) {
    if (language == 1) {
      this.preferedLanguage = 'sq-AL';
    } else {
      this.preferedLanguage = 'en-US';
    }
    await this.userService.updatePreferredLanguage(language);


  }
}

