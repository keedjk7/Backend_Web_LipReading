import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity( {name : "video"} )
export class Video extends BaseEntity{
  @PrimaryGeneratedColumn()
  video_id: number;

  @Column()
  user_create: number;
  
  @Column()
  video_name: string;
  
  @Column()
  video_origin_path: string;
  
  @Column()
  subtitle_path: string;
  
  @Column()
  product_path: string;
  
  @UpdateDateColumn()
  createAt : Date;

}
