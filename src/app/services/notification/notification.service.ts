import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { InternalObservableService } from "../internal-observable/internal-observable.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection;

  constructor(
    private storageService: StorageService,
    private internalObservablesService: InternalObservableService
  ) { }

  public startConnection = () => {
    const token = this.storageService.getAuthToken();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'hubs/notifications', { accessTokenFactory: () => this.storageService.getAuthToken() })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public listenToNotifications = () => {
    this.hubConnection.on('notificationCreated', (data) => {
      this.internalObservablesService.notificationSubject.next(data)
    });
  }

  public listenToForceLogout = () => {
    return new Promise(resolve => {
      this.hubConnection.on('logout', (message: string) => {
        resolve(message);
      })
    })
  }
}
