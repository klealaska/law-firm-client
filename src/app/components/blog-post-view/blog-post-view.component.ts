import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/interfaces/Pagination';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { BlogPostService } from 'src/app/services/blog-post/blog-post.service';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-blog-post-view',
  templateUrl: './blog-post-view.component.html',
  styleUrls: ['./blog-post-view.component.scss'],
})
export class BlogPostViewComponent implements OnInit {
  user;
  subscribe;
  id;
  imageUrl;
  profileImgUrl;
  threadId;
  commentThreads: any = new Array<any>();
  public blogPostComments: any;
  public comments = new Array<any>();
  public test = new Array<any>();
  public title = '';
  public publishedDate = new Date();
  public publishedBy = '';
  public description = '';
  public tagList = new Array<any>();
  public authors = new Array();
  public attachments = new Array();
  public authorsNameArray = new Array();
  public bannerData;
  authorsName;
  commentContent: string;
  replyCommentContent: string;
  newComment;
  replyComment;
  commentAvatar;
  showReplyComment: boolean = true;
  userEmail;
  showEditDeleteComment: boolean;
  hasUpvoted: boolean;
  editMode: boolean = false;
  editCommentContent;
  editReplyContent;
  colorOverlay;
  startPage: number;
  paginationLimit: number;
  index;
  showLess: boolean;
  canEdit: boolean = true;
  canEditReply: boolean = true;
  paginationModel: PaginationModel = {
    TotalItems: 0,
    PageNumber: 0,
    PageSize: 0,
  };

  constructor(
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private blogPostService: BlogPostService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private router: Router,
    private mazarsService: MazarsService,
    public matDialog: MatDialog
  ) {
    this.startPage = 0;
    this.paginationLimit = 6;
  }

  ngOnInit() {
    this.subscribe = this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.spinner.show();
      if (this.userService.isLoggedIn()) {
        this.getCurrentUserData();
      }
      this.getBlogPostItem();
      this.getBlogPostComments();
      this.spinner.hide();
    });
  }

  getBlogPostItem() {
    this.blogPostService.getById(this.id).subscribe(async (res: any) => {
      this.title = res.title;
      this.publishedDate = res.publishedDate;
      this.publishedBy = res.createdBy;
      this.description = res.description;
      this.tagList = res.blogPostTags;
      this.authors = res.authors;
      this.attachments = res.attachmentUrls;
      if (res.imageUrl != null) {
        this.imageUrl = res.imageUrl;
      } else {
        this.imageUrl = await this.getBlogPostBannerImage();
      }
    });
  }

  getCurrentUserData() {
    this.userService.getProfile().subscribe((res: any) => {
      this.userEmail = res.email;
      this.user = res.fullName;
      if (res.imagePath != null) {
        this.profileImgUrl = res.imagePath.split('\\').join('/');
      } else {
        this.profileImgUrl = null;
      }
    });
  }

  async getBlogPostBannerImage() {
    this.bannerData = await this.mazarsService.getBlogPostsBanner().toPromise();
    this.colorOverlay = this.bannerData.colorOverlay;
    return this.bannerData.imageUrl;
  }

  getBlogPostComments() {
    let paginate = new Pagination(this.paginationModel);
    this.blogPostService
      .getBlogPostComments(this.id, paginate)
      .subscribe((data: any) => {
        if (data != null) {
          this.blogPostComments = data.body;
          this.commentThreads.push(data.body.commentThreads);
          if (data.commentThreads != null) {
            data.commentThreads.forEach((commentThread) => {
              if (
                commentThread.comment.avatar != null ||
                commentThread.comment.avatar != undefined
              ) {
                commentThread.comment.avatar = commentThread.comment.avatar;
              } else {
                commentThread.comment.avatar = null;
              }
              commentThread.comment.replies.forEach((reply) => {
                if (reply.avatar != null || reply.avatar != undefined) {
                  reply.avatar = reply.avatar;
                } else {
                  reply.avatar = null;
                }
              });
              if (commentThread.comment.upvotes.length != 0) {
                if (commentThread.comment.upvotes.includes(this.userEmail)) {
                  commentThread.comment.hasUpvoted = true;
                }
              } else {
                commentThread.comment.hasUpvoted = false;
              }
              commentThread.comment.replies.forEach((reply) => {
                if (reply.upvotes.length != 0) {
                  if (reply.upvotes.includes(this.userEmail)) {
                    reply.hasUpvoted = true;
                  } else {
                    reply.hasUpvoted = false;
                  }
                } else {
                  reply.hasUpvoted = false;
                }
              });
            });
          }
        } else {
          this.commentThreads[0] = new Array();
        }
      });
  }

  async upvote(commentThreadId, comment, parent) {
    const data = {
      commentId: comment.id,
      threadId: commentThreadId,
      blogPostId: this.id,
      parentId: parent == 0 ? null : parent,
    };
    var res: any = await this.blogPostService.voteComment(data).toPromise();
    if (res) {
      var up = comment.upvotes.includes(this.userEmail);
      if (!up) {
        comment.hasUpvoted = true;
        comment.upvotes.unshift(this.userEmail);
      } else {
        comment.hasUpvoted = false;
        comment.upvotes.shift(this.userEmail);
      }
    }
  }

  async onComment() {
    const data = {
      blogPostId: this.id,
      threadId: '',
      content: this.commentContent,
      parentId: '',
    };
    var res: any = await this.blogPostService.postAddComment(data).toPromise();
    if (res.comment.avatar == null || res.comment.avatar == undefined) {
      res.comment.avatar = null;
    }
    this.newComment = res;
    this.commentThreads[0].unshift(this.newComment);
    this.commentContent = '';
  }

  async showEditCommentSection(comment) {
    comment.editMode = true;
    this.editCommentContent = comment.content;
    this.canEdit = false;
  }
  async showEditReplySection(reply) {
    reply.editMode = true;
    this.editReplyContent = reply.content;
    this.canEditReply = false;
  }

  async onUpdateComment(comment, thread, parent) {
    const data = {
      blogPostId: this.id,
      threadId: thread,
      commentId: comment.id,
      content: parent != 0 ? this.editReplyContent : this.editCommentContent,
      parentId: parent == 0 ? null : parent,
    };
    var res: any = await this.blogPostService.updateComment(data).toPromise();
    if (res) {
      if (parent == 0) {
        let updateItem = this.commentThreads[0].find(
          (x) => x.comment.id == comment.id
        );
        updateItem.comment.content = this.editCommentContent;
        this.editCommentContent = '';
        comment.editMode = false;
        this.canEdit = true;
      } else {
        var updatedcomment = this.commentThreads[0].find(
          (x) => x.comment.id == parent
        );
        let reply = updatedcomment.comment.replies.find(
          (x) => x.id == comment.id
        );
        reply.content = this.editReplyContent;
        this.editReplyContent = '';
        reply.editMode = false;
        this.canEditReply = true;
      }
    }
  }

  async onReplyComment(commentThreadId, parentId) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      content: this.replyCommentContent,
      parentId: parentId,
    };
    var res: any = await this.blogPostService.postAddComment(data).toPromise();
    if (res.comment.avatar == null || res.comment.avatar == undefined) {
      res.comment.avatar = null;
    }
    this.replyComment = res.comment;
    this.commentThreads[0].forEach((element) => {
      if (element.id == commentThreadId) {
        element.comment.replies.unshift(this.replyComment);
      }
    });
    this.replyCommentContent = '';
    this.showReplyComment = false;
  }

  showReplyCommentSection() {
    this.showReplyComment = true;
    if (this.userEmail === undefined) {
      this.router.navigate(['login']);
    }
  }

  deleteComment(commentThreadId, commentId) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      parentId: '',
      commentId: commentId,
    };
    this.blogPostService.deleteComment(data).subscribe(() => {
      this.commentThreads[0].forEach((element) => {
        if (element.id == commentThreadId) {
          this.commentThreads[0] = this.commentThreads[0].filter(
            (item) => item.id !== element.id
          );
          return this.commentThreads[0];
        }
      });
      this.toast.success('Comment deleted successfully');
    });
  }

  deleteReplyComment(commentThreadId, commentId, replyCommentId?) {
    const data = {
      blogPostId: this.id,
      threadId: commentThreadId,
      parentId: commentId,
      commentId: replyCommentId,
    };
    this.blogPostService.deleteComment(data).subscribe(
      () => {
        this.commentThreads[0].forEach((element) => {
          if (element.id === commentThreadId) {
            element.comment.replies.forEach((item) => {
              var index = null;
              if (item.id === replyCommentId) {
                index = element.comment.replies.indexOf(item);
                element.comment.replies.splice(index, 1);
              }
            });
          }
        });
        this.toast.success('Comment deleted successfully');
        return this.commentThreads[0];
      },
      () => {
        this.toast.warning('');
      }
    );
  }

  canEditAndDelete(author) {
    if (author === this.userEmail) {
      this.showEditDeleteComment = true;
    } else {
      this.showEditDeleteComment = false;
    }
  }

  tagsPage(tag) {
    this.mazarsService.tag = tag;
    this.router.navigate(['tags']);
  }

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 6;
  }

  showLessItems() {
    // this.paginationLimit = Number(this.paginationLimit) - 6;
  }
}
