import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Connection } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { EventEntity } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffeesConstants';

@Injectable()
export class CoffeesService {

  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'black coffee',
  //     brand: 'starbucks',
  //     flavors: ['chocolate', 'vanilla'],
  //   },
  // ];

  constructor(
    @InjectRepository(Coffee) 
  private readonly coffeeRepository : Repository<Coffee>,
    @InjectRepository(Flavor) 
  private readonly flavorRepository : Repository<Flavor>,
  private readonly connection : Connection,
    // @Inject('COFFEE_BRANDS') coffeeBrands:string[]
    @Inject(COFFEE_BRANDS) coffeeBrands:string[]
  ){
    console.log(coffeeBrands);
    
  }

  findAll(paginationQuery : PaginationQueryDto){
    const {limit,offset} = paginationQuery;
    // return this.coffees;
    return this.coffeeRepository.find({
      relations:['flavors'],
      skip:offset,
      take:limit
    });
  }

  async findById(id:string){
    // const coffee =  this.coffees.find(item => item.id === +id);
    const num = Number(id)
    // const coffee = await this.coffeeRepository.findOneBy({id:num});
    const coffee = await this.coffeeRepository.findOne({where:{id:num},relations:['flavors']});
    if(!coffee){
        throw new HttpException(`Coffe with ID ${id} doesnot exist`,HttpStatus.NOT_FOUND)
    }
    return coffee;
  }

  // async create(body : any){
  //   // this.coffees.push(body);
  //   // return body;
  //   const flavor = await Promise.all(
  //     body.flavors.map(name => this.preloadFlavorByName(name))
  //   )
  //   const coffee = this.coffeeRepository.create({...body,flavor});
  //   return this.coffeeRepository.save(coffee);
  // }

  async create(coffeeData: { name: string; brand: string; flavors: string[] }): Promise<Coffee> {
    // Create a new Coffee entity
    const coffee = new Coffee();
    coffee.name = coffeeData.name;
    coffee.brand = coffeeData.brand;

    // Check if flavors exist in the database, if not, create them
    const flavors = await Promise.all(
      coffeeData.flavors.map(async flavorName => {
        let flavor = await this.flavorRepository.findOne({ where:{name: flavorName} });
        if (!flavor) {
          flavor = new Flavor();
          flavor.name = flavorName;
          await this.flavorRepository.save(flavor);
        }
        return flavor;
      }),
    );

    // Assign flavors to the coffee
    coffee.flavors = flavors;

    // Save the coffee entity with its associated flavors
    return this.coffeeRepository.save(coffee);
  }


  async update(id:string,updateCoffee :any){
    // const existingcoffee = this.findById(id);
    // const flavor = await Promise.all(
      // updateCoffee.flavors.map(name => this.preloadFlavorByName(name))
    // )
    const flavor=[]
    const coffee = await this.coffeeRepository.preload({
      id:+id,
      ...updateCoffee,
      flavor
    });
    if(!coffee){
      throw new HttpException(`Coffe with ID ${id} doesnot exist`,HttpStatus.NOT_FOUND)
  }
  return this.coffeeRepository.save(coffee);

  }

  async remove(id:string){
    // const coffeeIndex =this.coffees.findIndex(item => item.id === +id);
    // if(coffeeIndex > 0){
    //         this.coffees.splice(coffeeIndex ,1);
    // } 
    const num = Number(id);
    const coffee = await this.coffeeRepository.findOneBy({id:num});
    return this.coffeeRepository.remove(coffee);
  }


  async recommedCoffee(coffee:Coffee){
    const queryRUnner = this.connection.createQueryRunner();

    await queryRUnner.connect();
    await queryRUnner.startTransaction();
    try {
      coffee.recommendation++;
      const recommendedEvent = new EventEntity();
      recommendedEvent.name = 'recommended-coffee';
      recommendedEvent.type = 'coffee';
      recommendedEvent.payload = {coffeeId:coffee.id}

      await queryRUnner.manager.save(coffee);
      await queryRUnner.manager.save(recommendedEvent);
      
      await queryRUnner.commitTransaction();

    } catch (error) {
      await queryRUnner.rollbackTransaction();

    }finally{
      await queryRUnner.release();
    }

  }


}
