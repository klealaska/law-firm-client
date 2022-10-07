import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PipeModule } from 'src/app/helpers/pipe/pipe.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogPostsComponent } from './blog-posts.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPostsComponent,
  },
];

@NgModule({
  declarations: [BlogPostsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    PipeModule,
    NgxSpinnerModule
  ]
})
export class BlogPostsModule { }
