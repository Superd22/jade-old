import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfgCriteresComponent } from './lfg-criteres.component';

describe('LfgCriteresComponent', () => {
  let component: LfgCriteresComponent;
  let fixture: ComponentFixture<LfgCriteresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfgCriteresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfgCriteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
