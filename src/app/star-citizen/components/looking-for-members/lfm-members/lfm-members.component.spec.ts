import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LfmMembersComponent } from './lfm-members.component';

describe('LfmMembersComponent', () => {
  let component: LfmMembersComponent;
  let fixture: ComponentFixture<LfmMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LfmMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LfmMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
