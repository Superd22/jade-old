import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfgGroupesComponent } from './lfg-groupes.component';

describe('LfgGroupesComponent', () => {
  let component: LfgGroupesComponent;
  let fixture: ComponentFixture<LfgGroupesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfgGroupesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfgGroupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
