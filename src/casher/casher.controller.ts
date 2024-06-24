import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CasherService } from './casher.service';
import { CreateManagerDto } from '../manager/dto/create-manager.dto';
import { UpdateManagerDto } from '../manager/dto/update-manager.dto';
import { SignInDto } from '../owner/dto/signin.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger'; 
import { CheckToken } from '../guards/check-token.guard';
import { Roles } from '../decorator/role';

@ApiTags('casher')
@Controller('casher')
@Roles('admin')
@UseGuards(CheckToken)
export class CasherController {
  constructor(private readonly casherService: CasherService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new casher' })
  @ApiBody({ type: CreateManagerDto })
  @ApiResponse({ status: 201, description: 'Returns the created casher' })
  create(@Body() createCasherDto: CreateManagerDto) {
    return this.casherService.create(createCasherDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in as a casher' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Returns the authentication result including a token and casher details' })
  signin(@Body() signInDto: SignInDto) {
    return this.casherService.signIn(signInDto);
  }

  @Get('all/:marketId')
  @ApiOperation({ summary: 'Get all cashers for a market' })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns an array of cashers for the specified market' })
  findAll(@Param('marketId') marketId: string) {
    return this.casherService.findAll(+marketId);
  }

  @Get('one/:id/:marketId')
  @ApiOperation({ summary: 'Get a casher by ID within a market' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the casher with the specified ID in the specified market' })
  findOne(@Param('id') id: string, @Param('marketId') marketId: string) {
    return this.casherService.findOne(+id, +marketId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a casher by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateManagerDto })
  @ApiResponse({ status: 200, description: 'Returns the updated casher' })
  update(@Param('id') id: string, @Body() updateCasherDto: UpdateManagerDto) {
    return this.casherService.update(+id, updateCasherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a casher by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns success upon successful deletion' })
  remove(@Param('id') id: string) {
    return this.casherService.remove(+id);
  }
}
