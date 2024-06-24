export class ProductItemDto {
  productId: number;
  count: number;
}

export class CreateOrderDto {
  marketId: number;
  products: ProductItemDto[];
}
