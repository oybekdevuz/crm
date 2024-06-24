import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../owner/dto/signin.dto';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly tokenService: TokensService,
) {}

  async signup(createAdminDto: CreateAdminDto) {
    const admin = await this.adminRepo.findOne({where: {phone: createAdminDto.phone}})
    if(admin) {
      throw new UnauthorizedException("Phone number already exists")
    }
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const newAdmin = this.adminRepo.create({...createAdminDto, password: hashedPassword})
    await this.adminRepo.save(newAdmin);
    newAdmin.password = undefined
    const {token} = await this.tokenService.getToken({role: 'admin', ...newAdmin})    
    return {message: "success", token, admin: newAdmin}
  }
  
  async signIn(signInDto: SignInDto) {
    const {phone, password} = signInDto
    const admin = await this.adminRepo.findOne({where: {phone}})
    if (!admin) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    const isMatchPass = await bcrypt.compare(password, admin.password);
    if (!isMatchPass) {
      throw new UnauthorizedException('phone number or password not correct');
    }
    admin.password = undefined;
    const {token} = await this.tokenService.getToken({role: 'admin', ...admin})    
    return {message: "success", token, admin: admin}

  }

  findAll() {
    return this.adminRepo.find();
  }

  findOne(id: number) {
    return this.adminRepo.findOne({where: {id}});
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    } else {
      delete updateAdminDto.password;
    }
    return await this.adminRepo.update({id}, {...updateAdminDto});
  
  }
  
  async remove(id: number) {
    const admin = await this.findOne(id);
    if (!admin) throw new NotFoundException("admin not found")
    await this.adminRepo.delete(id);
    return 'success';
  }
}
