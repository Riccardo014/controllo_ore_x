import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestProva } from '@modules/test-prova/entities/test-prova.entity';
import { TestProvaService } from '@modules/test-prova/services/test-prova.service';
import { TestProvaController } from '@modules/test-prova/controllers/test-prova.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestProva,
    ])
  ],
  controllers: [
    TestProvaController,
  ],
  exports: [
    TestProvaService,
  ],
  providers: [
    TestProvaService,
  ]
})
export class TestProvaModule {}