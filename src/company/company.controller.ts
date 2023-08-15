import {
  Controller,
  Body,
  Put,
  Post,
  Get,
  NotFoundException,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { StationService } from 'src/station/station.service';
import { Company } from './company.entity';
import { Station } from 'src/station/station.entity';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private stationService: StationService,
  ) {}

  @Post('')
  async addCompany(@Body() body: Company) {
    if (body.parent_company_id) {
      const parentCompany = await this.companyService.findOneCompany(
        body.parent_company_id,
      );
      body.parentCompany = parentCompany;
    }

    this.companyService.addCompany(body);
  }

  @Get()
  async findAllCompanies() {
    return this.companyService.findAllCompanies();
  }

  @Get(':id')
  async findOneCompany(@Param('id') id: number) {
    return this.companyService.findOneCompany(id);
  }

  @Put(':id')
  async updateCompany(@Param('id') id: number, @Body() newCompany: Company) {
    return this.companyService.updateCompany(id, newCompany);
  }

  @Delete(':id')
  async removeCompany(id: number) {
    return this.companyService.removeCompany(id);
  }

  @Get(':id/stations')
  async findStations(@Param('id') companyId: number) {
    const company = await this.companyService.findOneCompany(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company.stations;
  }

  @Get(':id/parent')
  async findParentCompany(@Param('id') companyId: number) {
    const company = await this.companyService.findOneCompany(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company.parentCompany;
  }

  @Post(':id/station')
  async addStationToCompany(
    @Param('id') companyId: number,
    @Body() station: Station,
  ) {
    const company = await this.companyService.findOneCompany(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    station.company = company;

    return this.stationService.addStation(station);
  }

  @Get(':id/all-stations')
  async getAllChargingStations(@Param('id') id: number) {
    const company = await this.companyService.findOneCompany(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.companyService.getAccessToAllStations(company);
  }
}
