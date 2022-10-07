import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { SharedModule } from './shared/shared.module';
import { DefaultLayoutComponent } from './containers';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./components/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./components/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: 'thank-you',
    loadChildren: () =>
      import('./components/thank-you-page/thank-you-page.module').then(
        (m) => m.ThankYouPageModule
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'blog-post-view/:id',
        loadChildren: () =>
          import('./components/blog-post-view/blog-post-view.module').then(
            (m) => m.BlogPostViewModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./components/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'tax-news',
        loadChildren: () =>
          import('./components/tax-news/tax-news.module').then(
            (m) => m.TaxNewsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'blog-posts',
        loadChildren: () =>
          import('./components/blog-posts/blog-posts.module').then(
            (m) => m.BlogPostsModule
          )
      },
      {
        path: 'laws/:code',
        loadChildren: () =>
          import('./components/laws/laws.module').then(
            (m) => m.LawsModule
          )
      },
      {
        path: 'laws/:groupCode/:lawCode/:code',
        loadChildren: () =>
          import('./components/laws/laws.module').then(
            (m) => m.LawsModule
          )
      },
      {
        path: 'bookmarks',
        loadChildren: () =>
          import('./components/bookmarks/bookmarks.module').then(
            (m) => m.BookmarksModule
          )
      },
      {
        path: 'question',
        loadChildren: () =>
          import('./components/question/question.module').then(
            (m) => m.QuestionModule
          )
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./components/contact/contact.module').then(
            (m) => m.ContactModule
          )
      },
      {
        path: 'videos',
        loadChildren: () =>
          import('./components/video-list/video-list.module').then(
            (m) => m.VideoListModule
          )
      },
      {
        path: 'tags',
        loadChildren: () =>
          import('./components/tags/tags/tags.module').then(
            (m) => m.TagsModule
          )
      },
      {
        path: 'blog-post-list/:category',
        loadChildren: () =>
          import('./components/blog-post-list/blog-post-list.module').then(
            (m) => m.BlogPostListModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
