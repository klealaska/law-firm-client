import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedLinksComponent } from './related-links.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [RelatedLinksComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  exports: [RelatedLinksComponent]
})
export class RelatedLinksModule { }
