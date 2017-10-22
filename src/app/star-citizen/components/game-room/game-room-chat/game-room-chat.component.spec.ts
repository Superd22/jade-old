import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomChatComponent } from './game-room-chat.component';

describe('GameRoomChatComponent', () => {
  let component: GameRoomChatComponent;
  let fixture: ComponentFixture<GameRoomChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRoomChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
