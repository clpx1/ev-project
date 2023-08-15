import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { StationModule } from './station/station.module';
import { Station } from './station/station.entity';
import { Company } from './company/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ev-project-db.sqlite',
      entities: [Company, Station],
      synchronize: true,
    }),
    StationModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
