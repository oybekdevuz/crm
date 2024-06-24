import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class OwnerService {
  constructor(
  @InjectRepository(Owner) private readonly ownerRepo: Repository<Owner>,
  private readonly tokenService: TokensService,
  ) {}

  async signup(createOwnerDto: CreateOwnerDto) {
    const owner = await this.ownerRepo.findOne({where: {phone: createOwnerDto.phone}})
    if(owner) {
      throw new UnauthorizedException("Phone number already exists")
    }
    const hashedPassword = await bcrypt.hash(createOwnerDto.password, 10);
    const newOwner = this.ownerRepo.create({...createOwnerDto, password: hashedPassword})
    await this.ownerRepo.save(newOwner);
    newOwner.password = undefined
    const {token} = await this.tokenService.getToken({role: 'super_admin', ...newOwner})    
    return {message: "success", token, owner: newOwner}
  }
  
  async signIn(signInDto: SignInDto) {
    const {phone, password} = signInDto
    const owner = await this.ownerRepo.findOne({where: {phone}})
    if (!owner) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    const isMatchPass = await bcrypt.compare(password, owner.password);
    if (!isMatchPass) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    owner.password = undefined;
    const {token} = await this.tokenService.getToken({role: 'super_admin', ...owner})    
    return {message: "success", token, owner: owner}

  }

  findAll() {
    return this.ownerRepo.find();
  }

  findOne(id: number) {
    return this.ownerRepo.findOne({where: {id}});
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto) {
    if (updateOwnerDto.password) {
      updateOwnerDto.password = await bcrypt.hash(updateOwnerDto.password, 10);
    } else {
      delete updateOwnerDto.password;
    }
    return await this.ownerRepo.update({id}, {...updateOwnerDto});
  
  }
  
  async remove(id: number) {
    const owner = await this.findOne(id);
    if (!owner) throw new NotFoundException("owner not found")
    await this.ownerRepo.delete(id);
    return 'success';
  }
}
