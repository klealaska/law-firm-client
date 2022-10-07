import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private getEndpoint = 'homePageLawConfiguration/getVisibleConfigurations';
  private language: string;

  constructor(private apiService: ApiService, private storageService: StorageService) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getAll() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getEndpoint}`);
    } else {
      return this.apiService.get(this.getEndpoint);
    }
  }
}
