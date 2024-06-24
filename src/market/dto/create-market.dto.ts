import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateMarketDto {
  @ApiProperty({example: "Muslim t shirts", description: "store's name"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({example: 1, description: "admin id"})
  @IsOptional()
  adminId?: number;
}