import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogPostsComponent implements OnInit {

  public latestBlogPosts = new Array();
  public popularBlogPosts = new Array();
  public onYourInterest = new Array();
  public blogPostBanner: any;
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 0, PageSize: 0 };
  image;
  color;
  description;
  title;
  constructor(
    private mazarsService: MazarsService,
    public userService: UserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.showSpinner();
  }

  showSpinner() {
    this.spinner.show();
    this.getBlogPostBanner();
    this.getLatestBlogPosts();
    this.getPopularBlogPosts();
    if (this.userService.isLoggedIn()) {
      this.getOnYourInterest();
    }
    this.spinner.hide();
  }

  getBlogPostBanner() {
    this.mazarsService.getBlogPostsBanner().subscribe((res: any) => {
      this.image = res.imageUrl;
      this.color = res.colorOverlay;
      this.description = res.description;
      this.title = res.title;
    });
  }

  getLatestBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getLatestBlogPost(paginate).subscribe((res: any) => {
      this.latestBlogPosts = res.body.slice(0, 3);
    });
  }

  getPopularBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getPopularBlogPosts(paginate).subscribe((res: any) => {
      this.popularBlogPosts = res.body.slice(0, 6);
    });
  }

  getOnYourInterest() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getBlogPostOfYourInterest(paginate).subscribe((res: any) => {
      this.onYourInterest = res.body.slice(0, 6);
    });
  }
}
