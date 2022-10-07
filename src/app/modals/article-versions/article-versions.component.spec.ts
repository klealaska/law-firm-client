import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVersionsComponent } from './article-versions.component';

describe('ArticleVersionsComponent', () => {
  let component: ArticleVersionsComponent;
  let fixture: ComponentFixture<ArticleVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
