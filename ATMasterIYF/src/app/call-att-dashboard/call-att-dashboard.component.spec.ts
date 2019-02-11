import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAttDashboardComponent } from './call-att-dashboard.component';

describe('CallAttDashboardComponent', () => {
  let component: CallAttDashboardComponent;
  let fixture: ComponentFixture<CallAttDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallAttDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallAttDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
