import { Component, OnInit } from '@angular/core';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { HomeService } from 'src/app/services/home/home.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tax-news',
  templateUrl: './tax-news.component.html',
  styleUrls: ['./tax-news.component.scss']
})
export class TaxNewsComponent implements OnInit {

  public taxNewsData: any;
  public taxNewsBanner: any;
  description;
  title;
  lawName;
  imageUrl;
  colorOverlay;


  constructor(
    private mazarsService: MazarsService,
    public homeService: HomeService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getTaxNewsBanner();
    this.getTaxNews();
  }

  getTaxNewsBanner() {
    this.mazarsService.getTaxNewsBanner().subscribe((result: any) => {
      this.colorOverlay = result.colorOverlay;
      this.description = result.description;
      this.imageUrl = result.imageUrl;
      this.title = result.title;
      this.lawName = result.lawName;
    });
  }

  getTaxNews() {
    this.spinner.show();
    this.mazarsService.getNews().subscribe((res: any) => {
      this.taxNewsData = res.body;
      this.taxNewsData.forEach(res => {
        if (res.imageUrl != null) {
          res.imageUrl = 'data:image/png;base64,' + res.imageUrl;
        }
      });
      this.spinner.hide();
    });
  }

  setLink(taxNewsAttachments: Array<any>, language) {
    if (taxNewsAttachments.some(x => x.url != null) && taxNewsAttachments.some(x => x.language == language)) {
      return taxNewsAttachments.find(x => x.language == language).url;
    }
    else {
      return null;
    }
  }
}
