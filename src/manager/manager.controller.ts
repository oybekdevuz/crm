import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { SignInDto } from '../owner/dto/signin.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CheckToken } from '../guards/check-token.guard';
import { Roles } from '../decorator/role';

@ApiTags('manager')
@ApiBearerAuth()
@Controller('manager')
@Roles('admin')
@UseGuards(CheckToken)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new manager' })
  @ApiBody({ type: CreateManagerDto })
  @ApiResponse({ status: 201, description: 'Returns the created manager' })
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in as a manager' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Returns the authentication result including a token and manager details' })
  signin(@Body() signInDto: SignInDto) {
    return this.managerService.signIn(signInDto);
  }

  @Get('all/:marketId')
  @ApiOperation({ summary: 'Get all managers for a market' })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns an array of managers for the specified market' })
  findAll(@Param('marketId') marketId: string) {
    return this.managerService.findAll(+marketId);
  }

  @Get('one/:id/:marketId')
  @ApiOperation({ summary: 'Get a manager by ID within a market' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the manager with the specified ID in the specified market' })
  findOne(@Param('id') id: string, @Param('marketId') marketId: string) {
    return this.managerService.findOne(+id, +marketId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a manager by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateManagerDto })
  @ApiResponse({ status: 200, description: 'Returns the updated manager' })
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(+id, updateManagerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a manager by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns success upon successful deletion' })
  remove(@Param('id') id: string) {
    return this.managerService.remove(+id);
  }
}
