import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MazarsService } from 'src/app/services/mazars/mazars.service';

@Component({
  selector: 'app-copy-link',
  templateUrl: './copy-link.component.html',
  styleUrls: ['./copy-link.component.scss']
})
export class CopyLinkComponent implements OnInit {
  @ViewChild('template', { static: false }) template: TemplateRef<any>;
  link;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-lg'
  };
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }
  openModal() {
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
