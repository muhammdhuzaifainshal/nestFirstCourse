import { PrimaryGeneratedColumn,Column, Index } from "typeorm";

@Index(['name','type'])
export class EventEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    type:string;

    @Index()
    @Column()
    name:string;
    
    @Column('json')
    payload:Record<string,any>
    
}
