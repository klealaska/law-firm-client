import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { PaginationModel } from 'src/app/interfaces/PaginationModel';
import { ArticleVersionsComponent } from 'src/app/modals/article-versions/article-versions.component';
import { CopyLinkComponent } from 'src/app/modals/copy-link/copy-link.component';
import { RelatedLinksComponent } from 'src/app/modals/related-links/related-links.component';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { SearchService } from 'src/app/services/search/search.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.scss'],

})
export class LawsComponent implements OnInit, AfterViewChecked {

  subscribe;
  code;
  public chapterWithSections: any;
  activeArticle;
  categoryName;
  groupName;
  categoryCode;
  fragment;
  groupCode: string;
  lawCode: string;
  userId: any;
  previousSection: string;
  links = new Array();
  lawName: any;
  public searchText: any;
  searchedWords$: Observable<string[]>
  matchCount: number;
  public index: number = 0;
  firstMatchFromSearch;
  lastMatchFromSearch;
  lawId;
  hyperLinks = new Array();
  keyword;
  url;
  searchResultArticles: any;
  currentChapter: any;
  searchConfig: any;
  isBookmarked: boolean;
  currentIndex;
  offsetTop = 50;
  articleLink;
  @ViewChild('showArticleVersions', { static: true }) showArticleVersions: ArticleVersionsComponent;
  @ViewChild('showRelatedLinks', { static: true }) showRelatedLinks: RelatedLinksComponent;
  @ViewChild('showCopyLink', { static: true }) showCopyLink: CopyLinkComponent;
  howManyClicks: number = 0;
  exportElementId: string = '';
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.exportElementId, // the id of html/table element
    options: { // html-docx-js document options
      margins: '50px'
    }
  };

  language: string = LanguageEnum.Albanian;
  articleVersions: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public mazarsService: MazarsService,
    private router: Router,
    private bookmarksService: BookmarksService,
    private userService: UserService,
    private toast: ToastrService,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    public matDialog: MatDialog,
    private exportAsService: ExportAsService,
    private storageService: StorageService
  ) {
    this.searchService.getResults$().subscribe((result: any) => {
      this.spinner.show();
      this.searchResultArticles = result;
      if (result.length > 0) {
        this.searchText = result[0].sentence;
        setTimeout(() => {
          if (result[0].sentence.length != 0) {
            this.findFirstAndLastMatch();
          }
        }, 100);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.searchText = "";
      }
    });
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  paginationModel: PaginationModel = { TotalItems: 0, PageNumber: 0, PageSize: 0 };

  ngOnInit() {
    this.subscribe = this.activatedRoute.paramMap.subscribe(async params => {
      this.code = params.get('code');
      this.groupCode = params.get('groupCode');
      this.lawCode = params.get('lawCode');
      this.mazarsService.code = this.code;
      this.mazarsService.groupCode = this.groupCode;
      this.activatedRoute.fragment.subscribe((fragment: string) => {
        this.fragment = { urlFragment: fragment, fragmentCopy: fragment };
      });
      await this.getChapterWithSections();
      this.getLinks();
    });
  }

  ngAfterViewChecked() {
    this.scrollToAnchor(this.fragment.urlFragment);
  }

  scrollingAnimation() {
    document.querySelectorAll("a[id]").forEach(link => {
      this.links.push(link);
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`div[class="col-lg-3"]  div[ class="position-section"] a[id="${id}"]`);
        if (entry.isIntersecting) {
          link.classList.add('visible');
          this.previousSection = entry.target.getAttribute('id');
        }
        else {
          if (link != null) {
            link.classList.remove('visible');
          }
        }
        this.highlightFirstActive();
      });
    }, {
      rootMargin: '0px',
      threshold: 1
    });
    // Track all headings that have an `id` applied
    document.querySelectorAll('h3[id]').forEach((heading) => {
      observer.observe(heading);
    });
  }

  highlightFirstActive() {
    let firstVisibleLink = document.querySelector('.visible');
    this.links.forEach(link => {
      link.classList.remove('active');
    });
    if (firstVisibleLink) {
      firstVisibleLink.classList.add('active');
    }
    if (!firstVisibleLink && this.previousSection) {
      if (document.querySelector(`a[href="#${this.previousSection}"]`) != null) {
        document.querySelector(`a[href="#${this.previousSection}"]`).classList.add('active');
      }
    }
  }

  async getChapterWithSections() {
    this.chapterWithSections = new Array();
    let data: any = await this.mazarsService.getChapterWithSections(this.code).toPromise();
    this.groupName = await this.getLawGroupById(data[0].category.parent.parentId);
    data.forEach(article => {
      this.categoryName = article.category.name;
      this.categoryCode = article.category.code;
      this.lawName = article.category.parent.name;
      this.lawId = article.category.parentId;
    });
    this.chapterWithSections = data;
  }

  async getLawGroupById(id) {
    let lawGroupData: any = await this.mazarsService.getLawCategoryById(id).toPromise();
    return lawGroupData.name;
  }

  async getLawArticleVersions(lawId) {
    this.showArticleVersions.lawId = lawId;
    this.showArticleVersions.openModal();
  }

  scroll(el) {
    this.setFragment(el);
    this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + el);
  }

  scrollToAnchor(location) {
    var element: any = document.getElementById(location);
    if (element != null) {
      element.scrollIntoView();
      this.fragment.urlFragment = null
    }
  }

  addBookmark(article) {
    const data = {
      lawArticleId: article.id,
      code: article.code,
      lawArticleName: article.title,
      url: `laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + article.code,
      language: this.language
    };
    if (!article.isBookmarked) {
      this.bookmarksService.addBookmark(data).subscribe((res: any) => {
        this.chapterWithSections.find(x => x.id === data.lawArticleId).isBookmarked = res.isBookmarked;
      });
    } else {
      this.removeBookmark(data.lawArticleId);
    }
  }

  removeBookmark(id) {
    this.bookmarksService.deleteBookMark(id).subscribe((res: any) => {
      this.chapterWithSections.find(x => x.id == id).isBookmarked = res.isBookmarked;
    });
  }

  setFragment(data) {
    this.fragment.fragmentCopy = data;
    this.fragment.urlFragment = data;
    this.scrollToAnchor(this.fragment.urlFragment);
  }

  findPrev(categoryCode: string) {
    let findCurrentChapter = this.searchResultArticles.find(x => x.chapterCode === categoryCode);
    this.find(-1, findCurrentChapter);
    this.findFirstAndLastMatch();
  }

  findNext(categoryCode: string) {
    let findCurrentChapter = this.searchResultArticles.find(x => x.chapterCode === categoryCode);
    if (this.howManyClicks == 0) {
      this.find(0, findCurrentChapter);
    } else {
      this.find(1, findCurrentChapter);
    }
    this.findFirstAndLastMatch();
    this.howManyClicks = 1;
  }

  findFirstAndLastMatch() {
    if (this.searchText) {
      let searchedText = document.querySelectorAll('.selected');
      this.firstMatchFromSearch = searchedText[0];
      this.lastMatchFromSearch = searchedText[searchedText.length - 1];
    }
  }

  find(increment: number, findCurrentChapter: any) {
    this.currentChapter = findCurrentChapter;
    if (this.searchText) {
      let searchedText = document.querySelectorAll('.selected');
      this.matchCount = searchedText.length;
      this.index += increment;

      // this.index = this.index < 0 ? this.matchCount - 1 : this.index;
      // this.index = this.index > this.matchCount - 1 ? 0 : this.index;
      if (this.index < 0) {
        this.index = searchedText.length - 1;
      }
      if (this.index > searchedText.length - 1) {
        this.index = 0;
      }

      if (this.matchCount) {
        let $current = searchedText[this.index];
        searchedText.forEach(element => {
          element.classList.remove("type-selected");
        });
        // searchedText[this.index].classList.remove("type-selected");
        if ($current) {
          $current.scrollIntoView(false);
          $current.classList.add('type-selected');
        }
      }
      // if (this.matchCount) {
      //   searchedText[this.index].classList.add('type-selected');
      //   searchedText[this.index].scrollIntoView(false);
      //   if (increment === 1 && searchedText[this.index - 1] != null) {
      //     searchedText[this.index - 1].classList.remove('type-selected');
      //   } else if (searchedText[this.index + 1] != null) {
      //     searchedText[this.index + 1].classList.remove('type-selected');
      //   }
      // }
      if (increment === 1) {
        if (searchedText[this.index] === this.lastMatchFromSearch) {
          if (this.currentChapter?.nextChapter !== null) {
            this.index = 0;
            this.howManyClicks = 0;
            this.router.navigateByUrl(`/laws/${this.groupCode}/${this.currentChapter?.lawCode}/${this.currentChapter?.nextChapter}`);

          } else {
            this.toast.warning("There is't next chapter that contain this sentence");
          }
        }
      } else if (increment === -1) {
        if (searchedText[this.index] === this.firstMatchFromSearch) {
          if (this.currentChapter?.previousChapter !== null) {
            this.index = 0;
            this.howManyClicks = 0;
            this.router.navigateByUrl(`/laws/${this.groupCode}/${this.currentChapter?.lawCode}/${this.currentChapter?.previousChapter}`);
          } else {
            this.toast.warning("There is't previous chapter that contain this sentence");
          }
        }
      }
    }
  }

  setAnchor(keyword, url) {
    document.querySelectorAll('.neni-para p').forEach(paragraph => {
      let content = paragraph.innerHTML; 4
      let k = "<a href=" + url + " target='_blank'> " + keyword + "</a>";
      var replace = new RegExp(keyword, "gi");
      content = content.replace(replace, k);
      paragraph.innerHTML = content;
    });

  }

  getLinks() {
    this.mazarsService.getHyperLinksByLawId(this.lawId).toPromise().then((result: any) => {
      this.hyperLinks = result.body;
      this.setHyperlinksToContent();
    }, error => {
      //this.toast.error(error.error.detail);
    });
  }

  setHyperlinksToContent() {
    const data = {
      Hyperlinks: this.hyperLinks,
      Articles: this.chapterWithSections
    };
    this.mazarsService.setHyperlinks(data).subscribe((result) => {
      this.chapterWithSections = result;
      setTimeout(() => {
        this.scrollingAnimation();
      }, 100);
    });
  }

  async openRelatedLinks(articleId) {
    this.showRelatedLinks.articleId = articleId;
    this.showRelatedLinks.openModal();
  }

  copyLink(link) {
    if (link === this.categoryCode) {
      this.articleLink = `${environment.clientUrl}laws/${this.groupCode}/${this.lawCode}/` + link;
    } else {
      this.articleLink = `${environment.clientUrl}laws/${this.groupCode}/${this.lawCode}/${this.code}` + "#" + link;
    }
    this.showCopyLink.link = this.articleLink;
    this.showCopyLink.openModal();

  }

  export(id, name) {
    this.exportAsConfig.elementIdOrContent = id;
    this.exportAsService.save(this.exportAsConfig, name).subscribe(() => {
      // save started
    });
  }
}
