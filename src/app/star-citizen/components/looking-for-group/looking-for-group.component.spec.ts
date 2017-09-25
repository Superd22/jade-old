import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookingForGroupComponent } from './looking-for-group.component';

describe('LookingForGroupComponent', () => {
  let component: LookingForGroupComponent;
  let fixture: ComponentFixture<LookingForGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookingForGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookingForGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
