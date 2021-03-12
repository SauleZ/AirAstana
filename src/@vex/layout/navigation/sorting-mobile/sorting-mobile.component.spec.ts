import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingMobileComponent } from './sorting-mobile.component';

describe('SortingMobileComponent', () => {
  let component: SortingMobileComponent;
  let fixture: ComponentFixture<SortingMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
