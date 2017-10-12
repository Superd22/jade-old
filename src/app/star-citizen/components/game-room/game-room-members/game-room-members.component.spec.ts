import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomMembersComponent } from './game-room-members.component';

describe('GameRoomMembersComponent', () => {
  let component: GameRoomMembersComponent;
  let fixture: ComponentFixture<GameRoomMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRoomMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
