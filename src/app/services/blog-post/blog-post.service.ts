import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pagination } from 'src/app/interfaces/Pagination';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private getByIdEndpoint = 'blogPosts/getById';
  private getBlogPostCommentsEndpoint = 'blogPosts';
  private postAddCommentEndPoint = 'blogPosts/addComment';
  private putUpdateCommentsEndpoint = 'blogPosts/updateComment';
  private voteCommentEndpoint = 'blogPosts/VoteComment';
  private deleteCommentEndpoint = 'BlogPosts/DeleteComment';
  private getBlogPostPerTagEndpoint = 'BlogPosts/GetBlogPostsPerTag';

  constructor(private apiService: ApiService) {}

  getById(id) {
    return this.apiService.get(this.getByIdEndpoint + '/' + id);
  }

  getBlogPostComments(blogPostId, pagination?: Pagination) {
    let url = this.getBlogPostCommentsEndpoint;
    if (pagination != null) {
      url = `${url}/${blogPostId}/getComments?skip=${pagination.Skip}&top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  postAddComment(data) {
    return this.apiService.post(this.postAddCommentEndPoint, data);
  }

  updateComment(data) {
    return this.apiService.put(this.putUpdateCommentsEndpoint, data);
  }

  voteComment(data) {
    return this.apiService.put(this.voteCommentEndpoint, data);
  }

  deleteComment(data) {
    return this.apiService.post(this.deleteCommentEndpoint, data);
  }

  getBlogPostsPerTag(tagId) {
    return this.apiService.get(`${this.getBlogPostPerTagEndpoint}/${tagId}`);
  }
}
