import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MustMatchDirective } from 'src/app/helpers/must-match.directive';
import { ConfirmEmailPopupComponent } from 'src/app/modals/confirm-email-popup/confirm-email-popup.component';
import { RegisterComponent } from './register.component';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
];

@NgModule({
  declarations: [
    RegisterComponent,
    MustMatchDirective,
    ConfirmEmailPopupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgSelectModule,
    MatButtonModule,
    MatDialogModule,
    NgxSpinnerModule
  ],
  entryComponents: [ConfirmEmailPopupComponent],
})
export class RegisterModule { }
