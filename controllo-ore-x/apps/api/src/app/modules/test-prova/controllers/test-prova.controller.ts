import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CastObjectPipe } from '@shared/pipes/cast-object.pipe';
import { AuthUser } from '@shared/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindBoostedOptions } from '@api-interfaces';
import { FindBoostedResult } from '@find-boosted';
import { TestProvaService } from '@modules/test-prova/services/test-prova.service';
import { TestProvaCreateDtoV } from '@modules/test-prova/dtov/test-prova-create.dtov';
import { TestProvaUpdateDtoV } from '@modules/test-prova/dtov/test-prova-update.dtov';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';

@ApiTags('testProvas')
@Controller('testProvas')
export class TestProvaController {
  constructor(private _testProvaService: TestProvaService) {
  }

  @Get()
  getMany(@Query(CastObjectPipe) query: any): Promise<FindBoostedResult<TestProva>> {
    return this._testProvaService.getMany(query);
  }

  @Post('fb')
  getManyFb(@Body() body: FindBoostedOptions): Promise<FindBoostedResult<TestProva>> {
    return this._testProvaService.getMany(body);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<TestProva> {
    return this._testProvaService.getOne(id);
  }

  @Post()
  create(@Body() data: TestProvaCreateDtoV, @AuthUser() user: User): Promise<TestProva> {
    return this._testProvaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() body: TestProvaUpdateDtoV,
         @AuthUser() user: User): Promise<UpdateResult> {
    return this._testProvaService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @AuthUser() user: User): Promise<DeleteResult> {
    return this._testProvaService.delete({ _id: id });
  }
}
