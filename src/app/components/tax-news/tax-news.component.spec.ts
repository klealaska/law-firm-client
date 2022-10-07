import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxNewsComponent } from './tax-news.component';

describe('TaxNewsComponent', () => {
  let component: TaxNewsComponent;
  let fixture: ComponentFixture<TaxNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
