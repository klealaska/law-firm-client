import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { MazarsService } from 'src/app/services/mazars/mazars.service';

@Component({
  selector: 'app-article-versions',
  templateUrl: './article-versions.component.html',
  styleUrls: ['./article-versions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleVersionsComponent implements OnInit {
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  lawId;
  articleVersionsList = new Array();
  accordionPaginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  paginationModel: PaginationModel = { TotalItems: 1, PageNumber: 1, PageSize: 0 };
  panelOpenState = false;
  displayedColumns: string[] = ['index', 'description'];
  dataSource;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg'
  };

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
    let pagination = new Pagination(this.accordionPaginationModel);
    let data: any = await this.mazarsService.getLawArticleVersionsAndDetails(this.lawId, pagination).toPromise();
    this.setPagination = data;
    console.log(data);
    console.log(this.paginationModel.PageSize, "page size");
    this.articleVersionsList = data.body;
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  goToArticle(articleLink) {
    return location.href = articleLink;
  }

  onHideModal() {
    this.modalRef.hide();
  }

}
