import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookingForMembersComponent } from './looking-for-members.component';

describe('LookingForMembersComponent', () => {
  let component: LookingForMembersComponent;
  let fixture: ComponentFixture<LookingForMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookingForMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookingForMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
