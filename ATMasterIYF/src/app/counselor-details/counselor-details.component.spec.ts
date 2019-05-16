import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorDetailsComponent } from './counselor-details.component';

describe('CounselorDetailsComponent', () => {
  let component: CounselorDetailsComponent;
  let fixture: ComponentFixture<CounselorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounselorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounselorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
