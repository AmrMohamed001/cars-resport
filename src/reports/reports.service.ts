import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from 'src/dtos/create-report.dto';
import { User } from 'src/users/users.entity';
import { ApproveReportDto } from 'src/dtos/approve-report.dto';
import { GetEstimationDto } from 'src/dtos/get-estimation.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(body: CreateReportDto, user: User) {
    let report = this.repo.create(body);
    report.user = user;
    return this.repo.save(report);
  }

  async update(id: number, body: boolean) {
    if (!id) return null;
    let report = await this.repo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('this report is not found');
    report.approved = body;
    return this.repo.save(report);
  }

  makeEstimation(dto: GetEstimationDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: dto.make })
      .andWhere('model = :model', { model: dto.model })
      .andWhere('lat - :lat BETWEEN 5 AND -5', { lat: dto.lat })
      .andWhere('lng - :lat BETWEEN 5 AND -5', { lng: dto.lng })
      .andWhere('year - :year BETWEEN 3 AND -3', { year: dto.year })
      .andWhere('approved = :approved', { approved: dto.approved })
      .orderBy('ABS(mileage - :mileage) ', 'DESC')
      .setParameters({ mileage: dto.mileage })
      .limit(3)
      .getRawOne();
  }
}
