import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VideoListComponent } from './video-list.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


const routes: Routes = [
  {
    path: '',
    component: VideoListComponent
  }
];

@NgModule({
  declarations: [VideoListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxSpinnerModule,


  ]
})
export class VideoListModule { }
