import { JadeUserEntity } from './jade-user.entity';
import { IJadeUser } from '../../../common/interfaces/User/jadeUser.interface';
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne } from "typeorm";

@Entity()
export class JadeUserAuthEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => JadeUserEntity)
    user: JadeUserEntity;

    @Column("varchar")
    scfr_token:string = "";
}