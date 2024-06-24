import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsStrongPassword, IsPhoneNumber } from "class-validator";

export class SignInDto {

  @ApiProperty({example: "+998931234567", description: "admin's phone number"})
  @IsPhoneNumber("UZ")
  @IsNotEmpty()
  phone: string;

  @ApiProperty({example: "Uzbek!$t0n", description: "Password must be strong"})
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
 