import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleVersionsComponent } from './article-versions.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ArticleVersionsComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    SharedModule
  ],
  exports: [ArticleVersionsComponent]
})
export class ArticleVersionsModule { }
