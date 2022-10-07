import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { MazarsService } from 'src/app/services/mazars/mazars.service';

@Component({
  selector: 'app-related-links',
  templateUrl: './related-links.component.html',
  styleUrls: ['./related-links.component.scss']
})
export class RelatedLinksComponent implements OnInit {
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  paginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  articleId;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg'
  };
  relatedLinks: any;
  set setPagination(res) {
    this.paginationModel.TotalItems = res.totalRecords;
    this.paginationModel.PageNumber = res.pageNumber;
    this.paginationModel.PageSize = res.pageSize;
  }

  constructor(
    private modalService: BsModalService,
    private mazarsService: MazarsService
  ) { }

  ngOnInit(): void {
  }

  async openModal() {
    let pagination = new Pagination(this.paginationModel);
    let relatedLinks: any = await this.mazarsService.getLawArticleRelatedLinksBySectionId(this.articleId, pagination).toPromise();
    this.setPagination = relatedLinks;
    this.relatedLinks = relatedLinks.body;
    console.log(this.relatedLinks, "related links in modal");

    console.log("Hello from modal");
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  onHideModal() {
    this.modalRef.hide();
  }

}
