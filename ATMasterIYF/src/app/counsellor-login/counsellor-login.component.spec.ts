import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorLoginComponent } from './counsellor-login.component';

describe('CounsellorLoginComponent', () => {
  let component: CounsellorLoginComponent;
  let fixture: ComponentFixture<CounsellorLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounsellorLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounsellorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
