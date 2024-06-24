import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({example: "Fruits", description: "name for category"})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({example: 1, description: "market id"})
  @IsNumber()
  @IsNotEmpty()
  marketId: number;
}
