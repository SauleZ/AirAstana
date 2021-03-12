import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarSortFilterComponent } from './toolbar-sort-filter.component';

describe('ToolbarSortFilterComponent', () => {
  let component: ToolbarSortFilterComponent;
  let fixture: ComponentFixture<ToolbarSortFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarSortFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarSortFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
