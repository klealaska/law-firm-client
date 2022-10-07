import { NgxSpinnerService } from 'ngx-spinner';
import { VideosService } from './../../services/videos/videos.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

  public videos = new Array();
  @ViewChildren('video') el: QueryList<any>;


  constructor(
    private videosService: VideosService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
  ) {

  }


  ngOnInit(): void {
    this.getAllVideos();
  }

  getAllVideos() {
    this.spinner.show();
    this.videosService.getAllVideos().subscribe((res: any) => {
      this.videos = res.body;
      this.videos.forEach(res => {
        if (res.link != null) {
          res.link = this.sanitizer.bypassSecurityTrustResourceUrl(res.link.replace("youtu.be", "youtube.be/embed").concat("?enablejsapi=1"));
        }
      });
      this.spinner.hide();
    }, () => {
      this.toastrService.error('Error! Cannot load videos, try again later.');
      this.spinner.hide();
    })
  }

  onClick() {
    this.el.forEach((el) => {
      el.nativeElement.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')

    })
  }


}




