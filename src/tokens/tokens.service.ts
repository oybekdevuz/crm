import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {

  constructor(private readonly jwtService: JwtService) { }
  async getToken(payload: any) {
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME
    })

    return {
      token: token,
    }
  }
}
