import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';
import { SignInDto } from '../owner/dto/signin.dto';
import { Market } from '../market/entities/market.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager) private readonly managerRepo: Repository<Manager>,
    @InjectRepository(Market) private readonly marketRepo: Repository<Market>,
    private readonly tokenService: TokensService
  ) {
    
  }

  async create(createManagerDto: CreateManagerDto) {
    const manager = await this.managerRepo.findOne({where: {phone: createManagerDto.phone}})
    const market = await this.marketRepo.findOne({where: {id: createManagerDto.marketId}, relations: ["manager"]})
    if(!market) throw new NotFoundException("Market not found") 
    if(manager) {
      throw new UnauthorizedException("Phone number already exists")
    }
    const hashedPassword = await bcrypt.hash(createManagerDto.password, 10);
    const newManager = this.managerRepo.create({...createManagerDto, password: hashedPassword})
    await this.managerRepo.save(newManager);
    market.manager = newManager
    await this.marketRepo.save(market);
    newManager.password = undefined
    return {message: "success", manager: newManager}
  }
  
  async signIn(signInDto: SignInDto) {
    const {phone, password} = signInDto
    const manager = await this.managerRepo.findOne({where: {phone}})
    if (!manager) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    const isMatchPass = await bcrypt.compare(password, manager.password);
    if (!isMatchPass) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    manager.password = undefined;
    const {token} = await this.tokenService.getToken({role: 'manager', ...manager})    
    return {message: "success", token, manager: manager}

  }

  async findAll(marketId: number) {
    const managers = await this.managerRepo.find({ where: { market: { id: marketId } } });
    return managers;
  }
  
  async findOne(id: number, marketId: number) {
    const manager = await this.managerRepo.findOne({ where: {id, market: { id: marketId } } });
    return manager;
  }

  async update(id: number, updateManagerDto: UpdateManagerDto) {
    const manager = await this.managerRepo.findOne({ where: { id } });
  
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }
  
    if (updateManagerDto.phone) {
      const managerWithSamePhone = await this.managerRepo.findOne({ where: { phone: updateManagerDto.phone } });
      if (managerWithSamePhone && managerWithSamePhone.id !== id) {
        throw new UnauthorizedException('Phone number already exists for another manager');
      }
    }
  
    if (updateManagerDto.password) {
      const hashedPassword = await bcrypt.hash(updateManagerDto.password, 10);
      manager.password = hashedPassword;
    }
  
    if (updateManagerDto.name) {
      manager.name = updateManagerDto.name;
    }
  
    await this.managerRepo.save(manager);
    manager.password = undefined;
    return manager;
  }
  
  async remove(id: number) {
    const managerToRemove = await this.managerRepo.findOne({ where: { id } });
  
    if (!managerToRemove) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }
  
    await this.managerRepo.remove(managerToRemove);
    return `success`;
  }
}
