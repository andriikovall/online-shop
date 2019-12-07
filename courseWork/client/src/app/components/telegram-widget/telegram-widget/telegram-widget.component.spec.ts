import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramWidgetComponent } from './telegram-widget.component';

describe('TelegramWidgetComponent', () => {
  let component: TelegramWidgetComponent;
  let fixture: ComponentFixture<TelegramWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelegramWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
