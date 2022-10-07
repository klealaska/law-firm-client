import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './bookmarks.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BookmarksComponent,
  },
];

@NgModule({
  declarations: [BookmarksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BookmarksModule { }
