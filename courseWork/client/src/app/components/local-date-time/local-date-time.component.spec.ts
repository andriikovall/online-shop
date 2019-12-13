import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDateTimeComponent } from './local-date-time.component';

describe('LocalDateTimeComponent', () => {
  let component: LocalDateTimeComponent;
  let fixture: ComponentFixture<LocalDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
