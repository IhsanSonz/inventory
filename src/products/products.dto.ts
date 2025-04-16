import { IsOptional } from '@nestjs/class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class UpdateProductDto extends IntersectionType(CreateProductDto) {}
