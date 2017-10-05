import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniGroupComponent } from './mini-group.component';

describe('MiniGroupComponent', () => {
  let component: MiniGroupComponent;
  let fixture: ComponentFixture<MiniGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
