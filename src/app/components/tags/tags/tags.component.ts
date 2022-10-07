import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { MazarsService } from 'src/app/services/mazars/mazars.service';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  public blogPostList=new Array();
  public tagId;
  public tagName;
  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 0, PageSize: 0 };

  constructor(
    private mazarsService: MazarsService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.tagId = this.mazarsService.tag.tagId;
    this.tagName = this.mazarsService.tag.name;
  }

  ngOnInit() {
    this.spinner.show();
    this.getBlogPost();
    this.spinner.hide();
  }

  getBlogPost() {
    let paginate = new Pagination(this.paginationModel);
    this.mazarsService.getBlogPostsPerTag(this.tagId,paginate).subscribe((data :any)=>{
    this.blogPostList=data.body;
  });
  }

  openBlogPost(id) {
    this.router.navigateByUrl(`/blog-post-view/${id}`);
  }
}
