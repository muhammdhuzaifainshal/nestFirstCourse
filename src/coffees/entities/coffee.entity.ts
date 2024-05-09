import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  name: string;
  @Column()
  brand: string;

  @Column({default:0})
  recommendation:number;

  // @Column('json',{nullable:true})
  @JoinTable()
  @ManyToMany(type => Flavor, flavor=>flavor.coffees,{
    cascade:true, //['insert']
  })
  flavors: Flavor[];
}
