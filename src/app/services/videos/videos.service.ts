import { ApiService } from './../api/api.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private getAllVideosEndpoint = 'HomepageVideo/getAll';

  constructor(
    private apiService: ApiService
  ) { }

  getAllVideos() {
    return this.apiService.get(this.getAllVideosEndpoint);
  }
}

