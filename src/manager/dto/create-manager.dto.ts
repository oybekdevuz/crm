import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsStrongPassword, IsPhoneNumber, IsNumber } from "class-validator";

export class CreateManagerDto {
  @ApiProperty({example: "Najim", description: "owner's name"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({example: "+998931234567", description: "owner's phone number"})
  @IsPhoneNumber("UZ")
  @IsNotEmpty()
  phone: string;

  @ApiProperty({example: "Uzbek!$t0n", description: "Password must be strong"})
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({example: 1, description: "market id"})
  @IsNumber()
  @IsNotEmpty()
  marketId: number;

}
 