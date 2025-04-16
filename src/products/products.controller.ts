import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';

@Controller('products')
@UseGuards(AccessTokenGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<any> {
    return {
      result: await this.productsService.create(createProductDto),
    };
  }

  @Get()
  async findAll(): Promise<any> {
    return {
      result: await this.productsService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return {
      result: await this.productsService.findOne(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return {
      result: await this.productsService.update(id, updateProductDto),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
