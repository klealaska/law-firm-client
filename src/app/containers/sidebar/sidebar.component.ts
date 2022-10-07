import { StorageLabelsEnum } from './../../enums/storageLabelsEnum';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user/user.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { MazarsService } from 'src/app/services/mazars/mazars.service';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { SearchService } from 'src/app/services/search/search.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageEnum } from 'src/app/enums/languageEnum';
import { StorageService } from 'src/app/services/storage/storage.service';

interface TreeNodeMazars {
  code: string;
  id: number;
  name: string;
  parentId: number;
  depth: number;
  branchDepth: number;
  isChapter: boolean;
  children?: TreeNodeMazars[];
  isClicked: boolean;
  countSearchWords: 0;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  treeNodeMazars: TreeNodeMazars[] = [];
  showFirstView: boolean = true;
  treeControl = new NestedTreeControl<TreeNodeMazars>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNodeMazars>();
  activeNodeCode;
  treeExpanded: boolean = false;
  activeNode;
  tree = new Array();
  currentNode = new Array();
  articleCode;
  node;
  subscribe;
  fragment;
  groupCode;
  lawCode: string;
  searchText;
  groupCodeForSearch;
  groupCodeTreeExpanded;
  countWordsForChapter;
  public innerWidth: any;
  isLoggedIn;
  language: string = LanguageEnum.Albanian;

  constructor(
    public mazarsService: MazarsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidenavService: SidenavService,
    private searchService: SearchService,
    private userService: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService
  ) {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.onResize(event);
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  async ngOnInit() {
    await this.getLawCategories();
  }

  async getLawCategories() {
    let result: any = await this.mazarsService.getSidebarTree();
    result.forEach(node => {
      node.isClicked = false;
      if (node.children.length > 0) {
        this.tree.push(node);
      }
    });
    this.dataSource.data = this.tree;
    this.activatedRoute.fragment.subscribe((fragment: string) => {
      this.activeNodeCode = fragment;
    });
    this.treeControl.dataNodes = this.dataSource.data;
    const tree = this.treeControl.dataNodes;
    this.expandTree(tree, this.activeNodeCode);
  }

  expandTree(data: TreeNodeMazars[], code: string) {
    data.forEach(node => {
      if (node.children && node.children.find(c => c.code === code)) {
        this.showFirstView = false;
        this.treeControl.expand(node);
        node.isClicked = true;
        this.treeExpanded = true;
        this.expandTree(this.treeControl.dataNodes, node.code)
      } else if (node.children && node.children.find(c => c.children)) {
        this.expandTree(node.children, code);
      }
    });
  }

  hasChild = (_: number, node: TreeNodeMazars) => !!node.children && node.children.length > 0;

  showSidebarFirstView() {
    this.showFirstView = true;
    this.treeExpanded = false;
    this.dataSource.data.forEach(node => {
      node.isClicked = false;
    });
    this.treeControl.collapseAll();
  }

  openChapterWithSections(code, isChapter) {
    this.dataSource.data.forEach(node => {
      node.children.forEach(childrenL1 => {
        childrenL1.children.forEach(childrenL2 => {
          if (childrenL2.code === code) {
            this.groupCode = node.code;
            this.lawCode = childrenL1.code;
          }
        });
      });
    });
    if (isChapter === true) {
      this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${code}`);
    }
    this.closeSideBar();
  }

  clickNode(node) {
    if (node.parentId === 0) {
      this.groupCodeForSearch = node.code;
    }
    this.node = node;
    if (node.depth == 1) {
      this.treeExpanded = false;
      node.isClicked = !node.isClicked;
      if (node.isClicked) {
        this.treeExpanded = true;
      }
    }
    this.showFirstView = false;
  }

  scroll(el) {
    this.dataSource.data.forEach(node => {
      node.children.forEach(childrenL1 => {
        childrenL1.children.forEach(childrenL2 => {
          childrenL2.children.forEach(childrenL3 => {
            if (childrenL3.code === el) {
              this.articleCode = childrenL2.code;
              this.lawCode = childrenL1.code;
              this.groupCode = node.code;
            }
          });
        });
      });
    });
    this.closeSideBar();
    this.router.navigateByUrl(`/laws/${this.groupCode}/${this.lawCode}/${this.articleCode}#${el}`);
  }

  doSearch() {
    this.groupCodeTreeExpanded = this.mazarsService.groupCode;
    if (this.searchText.length > 2) {
      this.searchText = this.searchText.trim();
      const data = {
        groupCode: this.groupCodeForSearch != null ? this.groupCodeForSearch : this.groupCodeTreeExpanded,
        keyword: this.searchText,
        language: this.language
      };
      this.searchService.postSearch(data).subscribe((result: any) => {
        this.dataSource.data.forEach(node => {
          node.children.forEach(childrenL1 => {
            childrenL1.children.forEach(childrenL2 => {
              this.countWordsForChapter = 0;
              childrenL2.children.forEach(childrenL3 => {
                result.forEach(element => {
                  if (childrenL3.id === element.lawArticleId) {
                    childrenL3.countSearchWords = element.countSentence;
                    this.countWordsForChapter += element.countSentence;
                  }
                });
              });
              childrenL2.countSearchWords = this.countWordsForChapter;
            });
          });
        });
        this.dataSource.data = this.tree;
        this.treeControl.dataNodes = this.dataSource.data;
        this.searchService.getSuggestion(result);
      });
    } else {
      this.toastr.warning('Enter 3 or more characters to search');
    }
    this.treeControl.expandAll();
    this.closeSideBar();
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  closeSideBar() {
    if (this.innerWidth <= 1279) {
      this.sidenavService.toggle();
    }
  }
}
