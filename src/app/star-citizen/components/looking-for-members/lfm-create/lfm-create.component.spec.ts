import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfmCreateComponent } from './lfm-create.component';

describe('LfmCreateComponent', () => {
  let component: LfmCreateComponent;
  let fixture: ComponentFixture<LfmCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfmCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfmCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
