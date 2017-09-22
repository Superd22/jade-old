import { SCGameRoomTextMessageEntity } from './game-room-text-message.entity';
import { JadeUserEntity } from './../user/jade-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { ISCGameMode } from "./../../../common/enums/game-mode.enum";
@Entity()
export class SCGameRoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    active: boolean = true;

    @Column("date")
    createdAt: Date = new Date();

    @ManyToOne(type => JadeUserEntity)
    createdBy: JadeUserEntity = null;

    @OneToMany(type => SCGameRoomTextMessageEntity, text => text.gameRoom, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    texts: SCGameRoomTextMessageEntity[];

    @Column("varchar")
    roomType: ISCGameMode = "star-citizen";
}