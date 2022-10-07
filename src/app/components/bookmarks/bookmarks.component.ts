import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  bookmarks = new Array();

  constructor(
    private bookmarksService: BookmarksService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.getAllBookMarks();
  }

  getAllBookMarks() {
    this.bookmarksService.getAllBookmarks().subscribe((bookmarks: any) => {
      this.bookmarks = bookmarks.body;
      this.bookmarks.forEach(bookmark => {
        bookmark.url = `/${bookmark.url}`;
      });
    });
  }

  deleteBookmark(id) {
    this.bookmarksService.deleteBookMark(id).subscribe(() => {
      this.toast.success('Bookmark removed');
      this.getAllBookMarks();
    });
  }
}
