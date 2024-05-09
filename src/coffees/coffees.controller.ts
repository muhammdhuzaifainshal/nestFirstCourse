import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}


  //   @Get()
  //   findAll(@Res() res) {
  //     // return 'This is a coffee flavor';
  //     res.status(200).send('This is a coffee flavor');
  //   }

  //   @Get('/flavors')
  //   findAll() {
  //     return 'This is a coffee flavor';
  //   }

//   @Get()
//   findAll(@Query() paginationQuery) {
//     const { limit, offset } = paginationQuery;
//     return `This action returns coffee with limits ${limit} and offset ${offset}`;
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return `this action returns params ${id}`;
//   }

  //   findOne(@Param() params) {
  //     return `this action returns params ${params.id}`;
  //   }

//   @Post()
//   //   @HttpCode(HttpStatus.GONE)
//   create(@Body('name') body) {
//     return body;
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() body) {
//     return `THis action updates ${id} coffee with ${body}`;
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return `THis action removes ${id} coffee`;
//   }

    @Get()
    findAll(@Query() paginationQuery : PaginationQueryDto){
      const { limit, offset } = paginationQuery;
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(':id')
    findByID(@Param('id') params ){
        return this.coffeeService.findById(params);
    }

    @Post()
    create(@Body() body : CreateCoffeeDto){
        return this.coffeeService.create(body)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body : CreateCoffeeDto){
        return this.coffeeService.update(id,body);
    }

    @Delete(':id')
    del(@Param('id') id:string){
        return this.coffeeService.remove(id)
    }

}
