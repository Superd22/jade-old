import { IJadeUser } from './../../../../common/interfaces/User/jadeUser.interface';
import { ISCGameRoom } from './../../../../common/interfaces/star-citizen/group.interface';
import { SCGameRoomEntity } from './../game-room.entity';
import { JadeUserEntity } from './../../user/jade-user.entity';
import { ISCGameRoomChatMessage } from './../../../../common/interfaces/star-citizen/game-room/chat-message.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class SCGameRoomMessage implements ISCGameRoomChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    /** text content of the message */
    @Column("varchar")
    text: string;

    /** user who posted that message */
    @ManyToOne(type => JadeUserEntity)
    user: IJadeUser;

    /** game room in which that message belongs */
    @ManyToOne(type => SCGameRoomEntity)
    gameRoom: ISCGameRoom;

    /** time of posting */
    @Column("datetime")
    time = new Date();
}