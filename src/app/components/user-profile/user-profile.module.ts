import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChangePasswordPopupComponent } from 'src/app/modals/change-password-popup/change-password-popup/change-password-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarModule } from 'ngx-avatar';



const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
  },
];

@NgModule({
  declarations: [UserProfileComponent, ChangePasswordPopupComponent],
  imports: [
    AvatarModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgSelectModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule
  ]
})
export class UserProfileModule { }
