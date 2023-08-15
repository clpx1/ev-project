import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station) private stationRepo: Repository<Station>,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {}

  async addStation(station: Station) {
    const newStation = this.stationRepo.create(station);

    return await this.stationRepo.save(newStation);
  }

  async findAllStations() {
    return await this.stationRepo.find();
  }

  async findOneStation(id: number) {
    const station = await this.stationRepo.findOne({
      where: {
        id,
      },
    });
    if (!station) throw new NotFoundException('Station not found');

    return station;
  }

  async updateStation(id: number, newStation: Station) {
    const station = await this.findOneStation(id);

    if (!station) {
      throw new NotFoundException('Station now found');
    }
    Object.assign(station, newStation);

    return this.stationRepo.save(newStation);
  }

  async removeStation(id: number) {
    const station = await this.findOneStation(id);

    if (!station) {
      throw new NotFoundException('Station now found');
    }

    return this.stationRepo.remove(station);
  }

  async orderedAllStations(
    latitude: number,
    longitude: number,
    radius: number,
    companyId: number,
  ) {
    const companyIds = await this.companyService.findAllCompanyTree(companyId);
    const data = await this.stationRepo
      .createQueryBuilder()
      .select([
        'station.*',
        `(
        6371 * acos(
          cos(radians(:latitude)) *
          cos(radians(station.latitude)) *
          cos(radians(station.longitude) - radians(:longitude)) +
          sin(radians(:latitude)) *
          sin(radians(station.latitude))
        )
      ) AS distance`,
      ])
      .where('station.company_id IN (:...companyIds)')
      .andWhere('distance < :radius')
      .orderBy('distance', 'ASC')
      .setParameters({ latitude, longitude, radius, companyIds })
      .getMany();

    return data;
  }
}
