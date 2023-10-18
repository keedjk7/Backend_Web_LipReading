import { BaseEntity,Entity,PrimaryGeneratedColumn, Column, UpdateDateColumn, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs' ;

@Entity( {name : "users"} )
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    // surname & lastname
    @Column()
    surname:string

    @Column()
    lastname:string

    @Column({unique : true})
    email:string;

    @Column({unique : true})
    username:string;

    @Column()
    password : string;

    @Column({ type: 'date' })
    birthday : Date;

    @Column()
    wallet_path : string;

    @Column()
    own_space : string;
    
    @UpdateDateColumn()
    createAt : Date;

    @UpdateDateColumn()
    updateAt : Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

}