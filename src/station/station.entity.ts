/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from '../company/company.entity';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @ManyToOne(() => Company, (company) => company.stations)
  company: Company;

  @Column()
  company_id: number;

  @Column()
  address: string;
}
