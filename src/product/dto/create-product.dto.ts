import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateProductDto {

  @ApiProperty({ example: 1, description: "Market ID" })
  @IsNumberString()
  @IsNotEmpty()
  marketId: number;
  
  @ApiProperty({ example: 1, description: "category ID" })
  @IsNumberString()
  @IsNotEmpty()
  categoryId: number;
  
  @ApiProperty({ example: "Samsung Galaxy S21", description: "Product name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "High-end smartphone", description: "Product description" })
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty({ example: "999.99", description: "Product price as a string" })
  @IsString()
  @IsNotEmpty()
  price: string;
  
  @ApiProperty({ example: "100.00", description: "Discount amount as a string" })
  @IsString()
  @IsNotEmpty()
  discount: string;

  @ApiProperty({ example: "100.00", description: "Cost amount as a string" })
  @IsString()
  @IsNotEmpty()
  cost: string;
  
  @ApiProperty({ example: 10, description: "Amount of the product available" })
  @IsNumberString()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: true, description: "Whether the product is active or not" })
  @IsBooleanString()
  @IsNotEmpty()
  is_active: string;

}
