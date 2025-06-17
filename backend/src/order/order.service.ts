import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async createOrder(order: CreateOrderDto) {
    const { customerName, items } = order;

    // Passo 1: Buscar os detalhes e preços REAIS de cada produto.
    const productDetailsPromises = items.map(async (item) => {
      const { productId, quantity } = item;
      const [source, externalId] = productId.split('-'); // ex: 'br-123' -> ['br', '123']

      // Lógica para chamar a API correta baseada na fonte
      const url = source === 'br'
        ? `${process.env.PROVIDER_URL}/brazilian_provider/${externalId}`
        : `${process.env.PROVIDER_URL}/european_provider/${externalId}`;

      try {
        const response = await firstValueFrom(this.httpService.get(url));
        const productData = response.data;
        const price = source === 'br' ? Number(productData.preco) * 100 : Number(productData.price) * 100;

        return {
          productId,
          quantity,
          priceAtTimeOfPurchase: price,
        };
      } catch (error) {
        throw new NotFoundException(`Produto com ID ${productId} não encontrado.`);
      }
    });

    const detailedItems = await Promise.all(productDetailsPromises);

    // Passo 2: Calcular o preço total no backend
    const totalPrice = detailedItems.reduce((total, item) => {
      return total + (item.priceAtTimeOfPurchase * item.quantity);
    }, 0);

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerName,
          totalPrice,
        },
      });

      const orderItemsData = detailedItems.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtTimeOfPurchase: item.priceAtTimeOfPurchase,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    // Retorna o pedido completo com os itens
    return this.prisma.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
    });
  }
}