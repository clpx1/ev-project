import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { Station } from '../station/station.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Station) private stationRepo: Repository<Station>,
  ) {}

  async addCompany(company: Company) {
    const newCompany = this.companyRepo.create(company);

    return await this.companyRepo.save(newCompany);
  }

  async findAllCompanies() {
    return await this.companyRepo.find({
      relations: ['stations', 'parentCompany'],
    });
  }

  async findOneCompany(id: number) {
    const company = await this.companyRepo.findOne({
      where: {
        id,
      },
      relations: ['stations', 'parentCompany'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async updateCompany(id: number, newCompany: Company) {
    const company = await this.findOneCompany(id);

    if (!company) {
      throw new NotFoundException('Company now found');
    }
    Object.assign(company, newCompany);

    return this.companyRepo.save(newCompany);
  }

  async removeCompany(id: number) {
    const company = await this.findOneCompany(id);

    if (!company) {
      throw new NotFoundException('Company now found');
    }

    return this.companyRepo.remove(company);
  }

  async getAccessToAllStations(company: Company) {
    let stations = [];

    if (company) {
      stations = await this.stationRepo.find({
        where: { company_id: company.id },
      });

      const childCompanies = await this.companyRepo.find({
        where: { parent_company_id: company.id },
      });

      for (const childCompany of childCompanies) {
        const childCompanyStations = await this.getAccessToAllStations(
          childCompany,
        );
        stations = stations.concat(childCompanyStations);
      }
    }

    return stations;
  }

  async findAllCompanyTree(companyId: number) {
    const result = [];

    const companyTree = async (id) => {
      const company = await this.findOneCompany(id);

      if (company) {
        result.push(company.id);

        const childCompanies = await this.companyRepo.find({
          where: { parent_company_id: id },
        });

        for (const child of childCompanies) {
          return await companyTree(child.id);
        }
      }
    };

    await companyTree(companyId);

    return result;
  }
}
