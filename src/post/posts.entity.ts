import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, UpdateDateColumn} from "typeorm";

@Entity( {name : "post"} )
export class Posts extends BaseEntity{

    @PrimaryGeneratedColumn()
    post_id:number
    
    @Column()
    post_description:string

    @Column()
    video_id:number

    @UpdateDateColumn()
    createAt:Date

}