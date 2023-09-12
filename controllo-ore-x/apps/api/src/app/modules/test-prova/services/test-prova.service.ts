import { Injectable } from '@nestjs/common';
import { CrudService } from '@shared/classes/crud-service.class';
import { TestProva } from '@modules/test-prova/entities/test-prova.entity';
import { TestProvaCreateDtoV } from '@modules/test-prova/dtov/test-prova-create.dtov';
import { TestProvaUpdateDtoV } from '@modules/test-prova/dtov/test-prova-update.dtov';

@Injectable()
export class TestProvaService extends CrudService<TestProva, TestProvaCreateDtoV, TestProvaUpdateDtoV> {
  target: typeof TestProva = TestProva;
}
