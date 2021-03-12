import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRouteComponent } from './flight-route.component';

describe('FlightRouteComponent', () => {
  let component: FlightRouteComponent;
  let fixture: ComponentFixture<FlightRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
