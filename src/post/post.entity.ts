import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, UpdateDateColumn} from "typeorm";

@Entity( {name : "post"} )
export class Posts extends BaseEntity{

    @PrimaryGeneratedColumn()
    post_id:number
    @Column()
    text:string

    @Column()
    file_path:string

    @UpdateDateColumn()
    createAt:Date

}