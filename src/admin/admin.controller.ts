import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../owner/dto/signin.dto';
import { CheckToken } from '../guards/check-token.guard';
import { Roles } from '../decorator/role';

@ApiTags("Admin")
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  @Roles('super_admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, description: 'The admin has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.signup(createAdminDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiResponse({ status: 200, description: 'Successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  signIn(@Body() signInDto: SignInDto) {
    return this.adminService.signIn(signInDto);
  }

  @Get()
  @Roles('super_admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Return all admins.' })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles('super_admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Return admin by ID.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Put(':id')
  @Roles('super_admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Update admin by ID' })
  @ApiResponse({ status: 200, description: 'The admin has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @Roles('super_admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Delete admin by ID' })
  @ApiResponse({ status: 200, description: 'The admin has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
