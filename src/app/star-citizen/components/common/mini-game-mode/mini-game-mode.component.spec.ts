import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniGameModeComponent } from './mini-game-mode.component';

describe('MiniGameModeComponent', () => {
  let component: MiniGameModeComponent;
  let fixture: ComponentFixture<MiniGameModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniGameModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniGameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
