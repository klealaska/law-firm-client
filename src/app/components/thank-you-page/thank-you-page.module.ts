import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThankYouPageComponent } from './thank-you-page.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: ThankYouPageComponent,
  },
];

@NgModule({
  declarations: [ThankYouPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ThankYouPageModule {}
