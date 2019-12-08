import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingEditFixComponent } from './shipping-edit-fix.component';

describe('ShippingEditFixComponent', () => {
  let component: ShippingEditFixComponent;
  let fixture: ComponentFixture<ShippingEditFixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingEditFixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingEditFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
