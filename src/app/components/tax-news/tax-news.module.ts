import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxNewsComponent } from './tax-news.component';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: TaxNewsComponent,
  },
];


@NgModule({
  declarations: [TaxNewsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxSpinnerModule
  ]
})
export class TaxNewsModule { }
