import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzlesNewComponent } from './puzzles-new.component';

describe('PuzzlesNewComponent', () => {
  let component: PuzzlesNewComponent;
  let fixture: ComponentFixture<PuzzlesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuzzlesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzlesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
