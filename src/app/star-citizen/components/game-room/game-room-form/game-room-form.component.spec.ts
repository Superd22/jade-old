import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomFormComponent } from './game-room-form.component';

describe('GameRoomFormComponent', () => {
  let component: GameRoomFormComponent;
  let fixture: ComponentFixture<GameRoomFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRoomFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
