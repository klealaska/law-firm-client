import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TagsComponent } from './tags.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



const routes: Routes = [
  {
    path: '',
    component: TagsComponent
  }
];

@NgModule({
  declarations: [TagsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    InfiniteScrollModule

  ]
})
export class TagsModule { }
