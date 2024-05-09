import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { EventEntity } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffeesConstants';

@Module({
    imports:[TypeOrmModule.forFeature([Coffee,Flavor,EventEntity])],
    controllers:[CoffeesController],
    providers:[CoffeesService,
    // {provide:'COFFEE_BRANDS',useValue:['buddy brew','nescafe']}
    {provide:COFFEE_BRANDS,useValue:['buddy brew','nescafe']}
    ],
    exports:[CoffeesService]
})
export class CoffeesModule {

}
