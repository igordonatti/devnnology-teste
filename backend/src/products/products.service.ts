import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { BrazilianProduct } from "src/models/brazilian-product";
import { EuropeanProduct } from "src/models/european-product";
import { StandardizedProduct } from "./types/StandardizedProduct";

@Injectable()
export class ProductsService {
  private readonly providerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    console.log('Provider URL from env:', process.env.PROVIDER_URL);
    const providerUrl = this.configService.get<string>('PROVIDER_URL');
    console.log('Provider URL from config service:', providerUrl);
    if (!providerUrl) {
      throw new Error('PROVIDER_URL environment variable is not defined');
    }
    this.providerUrl = providerUrl;
  }

  // Buscar todos os produtos de cada provider
  async getPaginatedProducts(
    page: number | string,
    limit: number | string,
    origin?: 'BR' | 'EU',
    sortBy?: string,
    sortOrder?: 'asc' | 'desc', 
  ) {
    // Converter e validar parâmetros de paginação
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be valid numbers');
    }

    if (pageNumber < 1 || limitNumber < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const [brProductsRaw, euProductsRaw] = await Promise.all([
      firstValueFrom(this.httpService.get(`${this.providerUrl}/brazilian_provider`)),
      firstValueFrom(this.httpService.get(`${this.providerUrl}/european_provider`)),
    ]).catch((err) => {
      console.log('Error fetching products: ', err);
      throw new Error('Failed to fetch products');
    })

    // Normalizar os dados 
    const brProducts: StandardizedProduct[] = brProductsRaw.data.map((product: BrazilianProduct) => ({
      id: `br-${product.id}`,
      name: product.nome,
      price: product.preco,
      description: product.descricao,
      image: [product.imagem],
      origin: 'BR',
    }));

    const euProducts: StandardizedProduct[] = euProductsRaw.data.map((product: EuropeanProduct) => ({
      id: `eu-${product.id}`,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.gallery,
      origin: 'EU',
    }));

    // Juntar os produtos
    let allProducts = [...brProducts, ...euProducts];

    if (origin) {
      allProducts = allProducts.filter(p => p.origin.toLowerCase() === origin.toLowerCase());
    }

    if (sortBy) {
      allProducts.sort((a, b) => {
        const orderModifier = sortOrder === 'asc' ? 1 : -1;

        switch (sortBy) {
          case 'price':
            return (Number(a.price) - Number(b.price)) * orderModifier;
          case 'name':
            return a.name.localeCompare(b.name) * orderModifier;
          default:
            return 0;
        }
      });
    }

    const total = allProducts.length;
    const offset = (pageNumber - 1) * limitNumber;
    const paginatedProducts = allProducts.slice(offset, offset + limitNumber);

    return {
      data: paginatedProducts,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    }
  }
}