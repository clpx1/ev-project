/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import { Station } from '../station/station.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parent_company_id: number;

  @Column()
  name: string;

  @ManyToOne(() => Company, { nullable: true })
  parentCompany: Company;

  @OneToMany(() => Station, (station) => station.company)
  stations: Station[];
}
