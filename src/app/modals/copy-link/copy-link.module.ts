import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CopyLinkComponent } from './copy-link.component';



@NgModule({
  declarations: [CopyLinkComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  exports: [CopyLinkComponent]
})
export class CopyLinkModule { }
