import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallingDetailsComponent } from './calling-details.component';

describe('CallingDetailsComponent', () => {
  let component: CallingDetailsComponent;
  let fixture: ComponentFixture<CallingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
