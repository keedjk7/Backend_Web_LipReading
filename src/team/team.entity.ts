import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";

@Entity( {name : "team"} )
export class Team extends BaseEntity{
    @PrimaryGeneratedColumn()
    team_id : number;

    // surname & lastname
    @Column({unique : true})
    team_name:string

    @Column()
    team_description:string

    // @Column()
    // team_member_role: Map<string, string>;
    @Column()
    picture_team:string

    @CreateDateColumn()
    createAt : Date;

    @Column()
    team_status:string

}