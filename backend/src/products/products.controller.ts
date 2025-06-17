import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getPaginatedProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('origin') origin?: 'BR' | 'EU',
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return await this.productsService.getPaginatedProducts(page, limit, origin, sortBy, order);
  }
}