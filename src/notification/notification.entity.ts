import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity( {name : "notification"} )
export class Notification extends BaseEntity{
    @PrimaryGeneratedColumn()
    notification_id : number;    
    
    @Column()
    sender_id:number

    @Column()
    receiver_id:number    
    
    @Column()
    team_id:number

    @Column()
    role:string    
    
    @Column()
    status:string

    @CreateDateColumn()
    inviteDate : Date;

}