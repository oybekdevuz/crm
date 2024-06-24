import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Casher } from './entities/casher.entity';
import { Repository } from 'typeorm';
import { Market } from '../market/entities/market.entity';
import { SignInDto } from '../owner/dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';
import { CreateManagerDto } from '../manager/dto/create-manager.dto';
import { UpdateManagerDto } from '../manager/dto/update-manager.dto';

@Injectable()
export class CasherService {

  constructor(
    @InjectRepository(Casher) private readonly casherRepo: Repository<Casher>,
    @InjectRepository(Market) private readonly marketRepo: Repository<Market>,
    private readonly tokenService: TokensService
) {}

  async create(createManagerDto: CreateManagerDto) {
    const casher = await this.casherRepo.findOne({where: {phone: createManagerDto.phone}})
    const market = await this.marketRepo.findOne({where: {id: createManagerDto.marketId}, relations: ["casher"]})
    
    if(!market) throw new NotFoundException("Market not found") 
    if(casher) {
      throw new UnauthorizedException("Phone number already exists")
    }
    const hashedPassword = await bcrypt.hash(createManagerDto.password, 10);
    const newCasher = this.casherRepo.create({...createManagerDto, password: hashedPassword})
    await this.casherRepo.save(newCasher);
    market.casher = newCasher
    await this.marketRepo.save(market);
    return {message: "success", casher: newCasher}
  }
  
  async signIn(signInDto: SignInDto) {
    const {phone, password} = signInDto
    const casher = await this.casherRepo.findOne({where: {phone}})
    if (!casher) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    const isMatchPass = await bcrypt.compare(password, casher.password);
    if (!isMatchPass) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    casher.password = undefined;
    const {token} = await this.tokenService.getToken({role: 'casher', ...casher})    
    return {message: "success", token, casher: casher}

  }

  async findAll(marketId: number) {
    const managers = await this.casherRepo.find({ where: { market: { id: marketId } } });
    return managers;
  }
  
  async findOne(id: number, marketId: number) {
    const casher = await this.casherRepo.findOne({ where: {id, market: { id: marketId } } });
    return casher;
  }

  async update(id: number, updateManagerDto: UpdateManagerDto) {
    const casher = await this.casherRepo.findOne({ where: { id } });
  
    if (!casher) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }
  
    if (updateManagerDto.phone) {
      const managerWithSamePhone = await this.casherRepo.findOne({ where: { phone: updateManagerDto.phone } });
      if (managerWithSamePhone && managerWithSamePhone.id !== id) {
        throw new UnauthorizedException('Phone number already exists for another casher');
      }
    }
  
    if (updateManagerDto.password) {
      const hashedPassword = await bcrypt.hash(updateManagerDto.password, 10);
      casher.password = hashedPassword;
    }
  
    if (updateManagerDto.name) {
      casher.name = updateManagerDto.name;
    }
  
    await this.casherRepo.save(casher);
    casher.password = undefined;
    return casher;
  }
  
  async remove(id: number) {
    const managerToRemove = await this.casherRepo.findOne({ where: { id } });
  
    if (!managerToRemove) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }
  
    await this.casherRepo.remove(managerToRemove);
    return `success`;
  }
}
