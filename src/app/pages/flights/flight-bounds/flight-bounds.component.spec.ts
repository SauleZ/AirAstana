import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBoundsComponent } from './flight-bounds.component';

describe('FlightBoundsComponent', () => {
  let component: FlightBoundsComponent;
  let fixture: ComponentFixture<FlightBoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
