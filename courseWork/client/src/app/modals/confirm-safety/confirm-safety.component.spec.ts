import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSafetyComponent } from './confirm-safety.component';

describe('ConfirmSafetyComponent', () => {
  let component: ConfirmSafetyComponent;
  let fixture: ComponentFixture<ConfirmSafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
