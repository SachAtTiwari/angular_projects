import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DyshandlerComponent } from './dyshandler.component';

describe('DyshandlerComponent', () => {
  let component: DyshandlerComponent;
  let fixture: ComponentFixture<DyshandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DyshandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyshandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
