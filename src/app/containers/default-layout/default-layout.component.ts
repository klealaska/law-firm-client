import { StorageService } from 'src/app/services/storage/storage.service';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/mazars.model';
import { InternalObservableService } from 'src/app/services/internal-observable/internal-observable.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { UserService } from 'src/app/services/user/user.service';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  public user: IUser = {} as IUser;
  imagePath: string;
  opened = true;
  over = 'side';
  expandHeight = '42px';
  collapseHeight = '42px';
  displayMode = 'flat';
  watcher: Subscription;

  public language: string = LanguageEnum.Albanian;
  albanian = LanguageEnum.Albanian;
  english = LanguageEnum.English;

  public notificationList = new Array();

  constructor(
    private router: Router,
    public userService: UserService,
    private internalObservablesService: InternalObservableService,
    private notificationService: NotificationService,
    private toast: ToastrService,
    public media: ObservableMedia,
    private sidenavService: SidenavService,
    private storageService: StorageService
  ) {
    this.watcher = media.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'md' || change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.opened = false;
        this.over = 'over';
      } else {
        this.opened = true;
        this.over = 'side';
      }
    });
  }

  ngOnInit() {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
    if (this.userService.isLoggedIn()) {
      this.getUserData();
      this.updateProfileImage();
    }
    this.notificationService.startConnection();
    this.notificationService.listenToNotifications();
    this.notificationService.listenToForceLogout().then((message: string) => this.onLogOut(true, message));
    this.listenNtifications();
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.router.navigate(['register']);
  }

  onLanguageChange(language) {
    this.language = language;
    this.storageService.setStorage(StorageLabelsEnum.appLanguage, language);
    location.reload();
  }

  getUserData() {
    this.userService.getProfile().subscribe((res: IUser) => {
      this.user.firstName = res.firstName;
      this.user.lastName = res.lastName;
      if (this.storageService.getStorage(StorageLabelsEnum.appLanguage) == null) {
        this.language = res.preferredLanguage;
      }
      if (res.imagePath != null) {
        this.imagePath = res.imagePath.split('\\').join('/');
      }
    });
  }

  goToProfile() {
    return this.router.navigate(['user-profile']);
  }

  updateProfileImage() {
    this.userService.getNotifications().subscribe((data: any) => {
      this.imagePath = data.image;
    });
  }

  onLogOut(isForced?: boolean, message?: string) {
    this.userService.logOut();
    if (isForced)
      this.toast.warning(message);
    else
      this.toast.success('Logged out!');

    this.router.navigate(['login']);
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  listenNtifications() {
    this.internalObservablesService.notificationSubject.subscribe(notification => {
      this.notificationList.push({ notification, time: `${new Date().getHours()}:${new Date().getMinutes()}` });
    });
  }

  route(url) {
    location.href = url;
  }
}
