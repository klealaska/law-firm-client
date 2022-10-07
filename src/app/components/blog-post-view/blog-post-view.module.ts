import { AvatarModule } from 'ngx-avatar';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogPostViewComponent } from './blog-post-view.component';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/helpers/pipe/pipe.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: BlogPostViewComponent,
  },
];


@NgModule({
  declarations: [BlogPostViewComponent],
  imports: [
    AvatarModule,
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    PipeModule,
    MatDialogModule,
    NgxSpinnerModule


  ]
})
export class BlogPostViewModule { }
