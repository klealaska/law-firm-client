import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogPostListComponent } from './blog-post-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipeModule } from 'src/app/helpers/pipe/pipe.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: BlogPostListComponent,
  },
];


@NgModule({
  declarations: [BlogPostListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipeModule,
    NgxSpinnerModule
  ]
})
export class BlogPostListModule { }
