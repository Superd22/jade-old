import { SCGameRoomEntity } from './game-room.entity';
import { JadeUserEntity } from './../user/jade-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, ManyToOne } from "typeorm";

@Entity()
export class SCGameRoomTextMessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("date")
    createdAt: Date = new Date();

    @ManyToOne(type => JadeUserEntity)
    author: JadeUserEntity = null;

    @Column("text")
    content: string = "";

    @ManyToOne(type => SCGameRoomEntity, room => room.texts, {
        cascadeAll: true,
    })
    gameRoom:SCGameRoomEntity
}