import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity( {name : "video"} )
export class Video extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  video_name: string;
  
  @Column()
  video_path: string;
  
  @Column()
  subtitle: string;
  
  @Column()
  product_path: string;
  
  @UpdateDateColumn()
  createAt : Date;

}
