import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './station.entity';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    TypeOrmModule.forFeature([Station]),
  ],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
