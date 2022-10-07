import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { UserRoleEnum } from 'src/app/enums/userRoleEnum';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private postLoginEndpoint = 'user/login/web';
  private postResetEndpoint = 'user/resetPassword';
  private getUserProfile = 'user/getProfile';
  private putUpdateEndpoint = 'user/update';
  private updateUserProfileImageEndpoint = 'user/UpdateUserProfileImage';
  public userSystemRoles = [UserRoleEnum.User];
  private notification = new Subject<any>();
  private userLanguage;

  get userPreferedLanguage() {
    return this.userLanguage;
  }

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  postLogin(data) {
    return this.apiService.post(this.postLoginEndpoint, data);
  }
  isLoggedIn() {
    return !!this.storageService.getAuthToken();
  }

  logOut() {
    return this.storageService.removeAuthToken();
  }

  postReset(data) {
    return this.apiService.post(this.postResetEndpoint, data);
  }
  getProfile() {
    return this.apiService.get(this.getUserProfile);
  }
  updateProfile(data) {
    return this.apiService.put(this.putUpdateEndpoint, data);
  }

  sendNotification(image: any) {
    this.notification.next({ image });
  }

  getNotifications(): Observable<any> {
    return this.notification.asObservable();
  }

  updateNotificationRules(type: string) {
    return this.apiService.get(`User/TurnNotifications/${type}`);
  }

  async updatePreferredLanguage(languageEnumId: number) {
    let res = await this.apiService.get(`User/ChangePreferredLanguage/${languageEnumId}`).toPromise();
    return res;
  }

  updateUserProfileImage(data) {
    return this.apiService.post(this.updateUserProfileImageEndpoint, data);
  }


}
