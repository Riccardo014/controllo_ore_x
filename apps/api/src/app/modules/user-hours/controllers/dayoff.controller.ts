import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { DayoffCreateDtoV } from '@modules/user-hours/dtov/dayoff-create.dtov';
import { DayoffUpdateDtoV } from '@modules/user-hours/dtov/dayoff-update.dtov';
import { DayoffService } from '@modules/user-hours/services/dayoff.service';
import { User } from '@modules/user/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Dayoff } from '../entities/dayoff.entity';

@ApiTags('dayoffs')
@Controller('dayoffs')
export class DayoffController {
  constructor(private _dayoffService: DayoffService) {}

  @Get()
  getMany(
    @Query(CastObjectPipe) query: any,
  ): Promise<FindBoostedResult<Dayoff>> {
    return this._dayoffService.getMany(query);
  }

  @Post('fb')
  getManyFb(
    @Body() body: FindBoostedOptions,
  ): Promise<FindBoostedResult<Dayoff>> {
    return this._dayoffService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Dayoff> {
    return this._dayoffService.getOne(id, ['user', 'hoursTag']);
  }

  @Post()
  create(
    @Body() data: DayoffCreateDtoV,
    @AuthUser() user: User,
  ): Promise<Dayoff> {
    return this._dayoffService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: DayoffUpdateDtoV,
  ): Promise<UpdateResult> {
    return this._dayoffService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this._dayoffService.delete({ _id: id });
  }
}
