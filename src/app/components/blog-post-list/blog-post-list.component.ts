import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.scss']
})
export class BlogPostListComponent implements OnInit {
  subscribe: any;
  blogCategory: string;
  public latestBlogPosts = new Array();
  public popularBlogPosts = new Array();
  public onYourInterest = new Array();
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 0, PageSize: 0 };

  constructor(
    private activatedRoute:ActivatedRoute,
    private mazarsService:MazarsService,
    public userService:UserService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.subscribe = this.activatedRoute.paramMap.subscribe(params => {
      this.blogCategory = params.get('category');
      if(this.blogCategory=='latest'){
        this.getLatestBlogPosts();
      }else if(this.blogCategory=='interest'&&this.userService.isLoggedIn()){
        this.getOnYourInterest();
      }else if(this.blogCategory=='popular'){
        this.getPopularBlogPosts();
      }else{
        this.router.navigate(['login']);
      }
 });

  }
  getLatestBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getLatestBlogPost(paginate).subscribe((res: any) => {
      this.latestBlogPosts = res.body;
   });
  }

  getPopularBlogPosts() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getPopularBlogPosts(paginate).subscribe((res: any) => {
      this.popularBlogPosts = res.body;
   });
  }

  getOnYourInterest() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getBlogPostOfYourInterest(paginate).subscribe((res: any) => {
      this.onYourInterest = res.body;
   });
  }

}
