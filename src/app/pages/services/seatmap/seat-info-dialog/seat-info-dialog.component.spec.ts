import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatInfoDialogComponent } from './seat-info-dialog.component';

describe('SeatInfoDialogComponent', () => {
  let component: SeatInfoDialogComponent;
  let fixture: ComponentFixture<SeatInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
