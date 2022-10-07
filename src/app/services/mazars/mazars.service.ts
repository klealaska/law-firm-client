import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StorageLabelsEnum } from 'src/app/enums/storageLabelsEnum';
import { Pagination } from 'src/app/interfaces/Pagination';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { LanguageEnum } from './../../enums/languageEnum';

@Injectable({
  providedIn: 'root'
})
export class MazarsService {

  private getTaxNewsBannerEndpoint = 'homePageLawConfiguration/getTaxNewsConfiguration';
  private getTaxNews = 'taxNews/getAll';
  private getBlogPostBannerEndpoint = 'homePageLawConfiguration/getBlogPostConfiguration';
  private getBlogPost = 'blogPosts/getAll';
  private getPopularBlogPostsEndpoint = 'blogPosts/getPopularBlogPosts';
  private getLawCategoriesEndpoint = 'lawCategories/GetSidebarTree';
  private getLawCategoryByIdEndpoint = 'lawCategories/getById';
  private getChapterWithSectionsEndpoint = 'lawCategories/getChapterWithSectionsByChapterCode';
  private getHyperlinksEndpoint = 'HyperLink/GetAll';
  private setHyperLinksEndpoint = 'HyperLink/Setlinks';
  private getLawArticleRelatedLinksBySectionIdEndpoint = 'lawArticleRelatedLinks/getLawArticleRelatedLinksBySectionId';
  private getLawArticleVersionsAndDetailsEndpoint = 'LawArticleVersions/GetLawArticleVersionsAndDetails';
  private getLatestBlogPostEndpoint = 'BlogPosts/GetAllLatest';
  private getBlogPostOfYourInterestEndpoint = 'BlogPosts/GetBlogPostOfYourInterest';
  private getTagByIdEndpoint='blogPosts/GetBlogPostsPerTag'

  code;
  groupCode;
  relatedLinks;
  articleLink;
  tag;
  language: string = LanguageEnum.Albanian;
  sidebarTreeData = new Array();

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private storageService: StorageService,
    private toastr: ToastrService
  ) {
    this.language = this.storageService.getStorage(StorageLabelsEnum.appLanguage);
  }

  getLawCategories() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getLawCategoriesEndpoint}`);
    } else {
      return this.apiService.get(`${this.getLawCategoriesEndpoint}`);
    }
  }

  getTaxNewsBanner() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getTaxNewsBannerEndpoint}`);
    } else {
      return this.apiService.get(this.getTaxNewsBannerEndpoint);
    }
  }

  getNews() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getTaxNews}`);
    } else {
      return this.apiService.get(this.getTaxNews);
    }
  }

  getBlogPostsBanner() {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getBlogPostBannerEndpoint}`);
    } else {
      return this.apiService.get(this.getBlogPostBannerEndpoint);
    }
  }

  getBlogPosts() {
    return this.apiService.get(this.getBlogPost);
  }

  getLatestBlogPost(pagination?: Pagination) {
    let url = this.getLatestBlogPostEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getBlogPostsPerTag(tagId,pagination?:Pagination) {
    let url = this.getTagByIdEndpoint;
    if (pagination != null) {
      url = `${url}/${tagId}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
 }

  getPopularBlogPosts(pagination?: Pagination) {
    let url = this.getPopularBlogPostsEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getBlogPostOfYourInterest(pagination?: Pagination) {
    let url = this.getBlogPostOfYourInterestEndpoint;
    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getChapterWithSections(code) {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getChapterWithSectionsEndpoint}/${code}`);
    } else {
      return this.apiService.get(`${this.getChapterWithSectionsEndpoint}/${code}`);
    }
  }

  getLawCategoryById(id) {
    if (this.language != null) {
      return this.apiService.get(`${this.language}/${this.getLawCategoryByIdEndpoint}/${id}`);
    } else {
      return this.apiService.get(`${this.getLawCategoryByIdEndpoint}/${id}`);
    }
  }

  getHyperLinksByLawId(id?, language?) {
    let url = `${this.getHyperlinksEndpoint}`;
    if (id != null) {
      url = `${url}?id=${id}`;
    }
    if (language != null) {
      url = `${language}/${url}`;
    }
    return this.apiService.get(url);
  }

  setHyperlinks(data) {
    return this.apiService.post(this.setHyperLinksEndpoint, data);
  }

  getLawArticleRelatedLinksBySectionId(id, pagination?: Pagination) {
    let url = `${this.getLawArticleRelatedLinksBySectionIdEndpoint}`;
    if (id != null) {
      url = `${url}?id=${id}&`;
    } else {
      url = `${url}?`;
    }
    if (this.language != null) {
      url = `${this.language}/${url}`;
    }
    if (pagination != null) {
      url = `${url}$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  getLawArticleVersionsAndDetails(id, pagination?) {
    let url = `${this.language}/${this.getLawArticleVersionsAndDetailsEndpoint}`;
    if (id != null) {
      url = `${url}?lawId=${id}&`;
    } else {
      url = `${url}?`;
    }
    if (pagination != null) {
      url = `${url}$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  //#region Storage Data

  async getSidebarTree() {
    let sidebarTreeData = JSON.parse(this.storageService.getStorage(StorageLabelsEnum.sidebarTree));
    if (sidebarTreeData != null) {
      if (sidebarTreeData.language == this.language) {
        return sidebarTreeData.result;
      } else {
        let result = await this.getLawCategories().toPromise();
        this.setSidebarTreeState(result);
        return result;
      }
    } else {
      let result = await this.getLawCategories().toPromise();
      this.setSidebarTreeState(result);
      return result;
    }
  }

  private setSidebarTreeState(result) {
    this.storageService.removeStorage(StorageLabelsEnum.sidebarTree);
    let state = {
      language: this.language,
      result: result
    }
    this.storageService.setStorage(StorageLabelsEnum.sidebarTree, JSON.stringify(state));
  }
  //#endregion
}
