import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { ExportAsModule } from 'ngx-export-as';
import { NgxMarkjsModule } from 'ngx-markjs';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SidebarComponent } from 'src/app/containers/sidebar/sidebar.component';
import { HighlightDirective } from 'src/app/directives/highlight.directive';
import { MarkjsHighlightDirective } from 'src/app/directives/markjs.highlight.directive';
import { ArticleVersionsComponent } from 'src/app/modals/article-versions/article-versions.component';
import { ArticleVersionsModule } from 'src/app/modals/article-versions/article-versions.module';
import { CopyLinkComponent } from 'src/app/modals/copy-link/copy-link.component';
import { CopyLinkModule } from 'src/app/modals/copy-link/copy-link.module';
import { RelatedLinksComponent } from 'src/app/modals/related-links/related-links.component';
import { RelatedLinksModule } from 'src/app/modals/related-links/related-links.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LawsComponent } from './laws.component';

const routes: Routes = [
  {
    path: '',
    component: LawsComponent,
  },
];


@NgModule({
  declarations: [LawsComponent, HighlightDirective, MarkjsHighlightDirective],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxSpinnerModule,
    NgxMarkjsModule,
    MatDialogModule,
    NgxPrintModule,
    ExportAsModule,
    ArticleVersionsModule,
    RelatedLinksModule,
    CopyLinkModule
  ],
  entryComponents: [SidebarComponent, MarkjsHighlightDirective, ArticleVersionsComponent, RelatedLinksComponent, CopyLinkComponent]
})
export class LawsModule { }
