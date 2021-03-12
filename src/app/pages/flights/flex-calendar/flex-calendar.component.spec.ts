import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexCalendarComponent } from './flex-calendar.component';

describe('FlexCalendarComponent', () => {
  let component: FlexCalendarComponent;
  let fixture: ComponentFixture<FlexCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
