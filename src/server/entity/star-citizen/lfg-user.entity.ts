import { JadeUserEntity } from './../user/jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class JadeLFGUserEntity  {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => JadeUserEntity, user => user.lfg)
    @JoinColumn()
    user: JadeUserEntity = null;


}