import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { SignInDto } from './dto/signin.dto';

@ApiTags('owners')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create owner' })
  @ApiResponse({ status: 201, description: 'The owner has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownerService.signup(createOwnerDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in owner' })
  @ApiResponse({ status: 200, description: 'Successfully signed in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  signIn(@Body() signInDto: SignInDto) {
    return this.ownerService.signIn(signInDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all owners' })
  @ApiResponse({ status: 200, description: 'Return all owners.' })
  findAll() {
    return this.ownerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get owner by ID' })
  @ApiResponse({ status: 200, description: 'Return owner by ID.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  findOne(@Param('id') id: string) {
    return this.ownerService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update owner by ID' })
  @ApiResponse({ status: 200, description: 'The owner has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownerService.update(+id, updateOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete owner by ID' })
  @ApiResponse({ status: 200, description: 'The owner has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Owner not found.' })
  remove(@Param('id') id: string) {
    return this.ownerService.remove(+id);
  }
}
