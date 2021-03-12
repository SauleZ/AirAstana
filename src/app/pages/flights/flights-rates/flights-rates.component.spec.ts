import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsRatesComponent } from './flights-rates.component';

describe('FlightsRatesComponent', () => {
  let component: FlightsRatesComponent;
  let fixture: ComponentFixture<FlightsRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
