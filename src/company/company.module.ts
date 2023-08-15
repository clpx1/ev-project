import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { StationModule } from '../station/station.module';
import { Station } from 'src/station/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    TypeOrmModule.forFeature([Station]),
    StationModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
