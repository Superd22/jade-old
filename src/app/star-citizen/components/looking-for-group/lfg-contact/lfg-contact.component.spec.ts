import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfgContactComponent } from './lfg-contact.component';

describe('LfgContactComponent', () => {
  let component: LfgContactComponent;
  let fixture: ComponentFixture<LfgContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfgContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfgContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
