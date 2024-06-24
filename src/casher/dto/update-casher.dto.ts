import { PartialType } from '@nestjs/swagger';
import { CreateCasherDto } from './create-casher.dto';

export class UpdateCasherDto extends PartialType(CreateCasherDto) {}
