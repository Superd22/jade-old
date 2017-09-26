import { PrimaryGeneratedColumn } from 'typeorm';
import { JadeUserEntity } from './jade-user.entity';
import { Index } from 'typeorm';
import { Column } from 'typeorm';
import { JoinColumn } from 'typeorm';
import { OneToOne, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JadeUserHandleCodeEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    /** handle we can verify */ 
    @OneToOne(type => JadeUserEntity, user => user._handleCode, {cascadeAll: true})
    user: JadeUserEntity;

    /** verification code */
    @Column("varchar")
    code: string = (Math.random()*1e32).toString(36);


}