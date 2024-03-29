import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity( {name : "privilege"} )
export class Privilege extends BaseEntity{

    @PrimaryGeneratedColumn()
    privilege_id:number
    @Column()
    team_id:number

    @Column()
    user_id:number

    @Column()
    role:string

    @Column()
    post_id:number

    @CreateDateColumn()
    createDate:Date


}