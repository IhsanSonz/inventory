import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from 'src/schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
      lean: true,
    });
  }

  async remove(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndDelete(id);
  }
}
