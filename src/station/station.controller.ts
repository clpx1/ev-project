import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { StationService } from './station.service';
import { Station } from './station.entity';

@Controller('station')
export class StationController {
  constructor(private stationService: StationService) {}

  @Get()
  async findAllStations() {
    return this.stationService.findAllStations();
  }

  @Get('all-grouped')
  async getAllGroupedStations(
    @Query('lat') latitude: number,
    @Query('lon') longitude: number,
    @Query('radius') radius: number,
    @Query('companyId') companyId: number,
  ) {
    const stations = await this.stationService.orderedAllStations(
      latitude,
      longitude,
      radius,
      companyId,
    );

    return stations;
  }

  @Get(':id')
  async findOneStation(@Param('id') id: number) {
    return this.stationService.findOneStation(id);
  }

  @Post('')
  async addStation(@Body() station: Station) {
    return this.stationService.addStation(station);
  }

  @Put(':id')
  async updateStation(@Param('id') id: number, @Body() newStation) {
    return this.stationService.updateStation(id, newStation);
  }

  @Delete(':id')
  async removeStation(@Param('id') id: number) {
    return this.stationService.removeStation(id);
  }
}
