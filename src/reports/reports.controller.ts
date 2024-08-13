import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReportDto } from 'src/dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from 'src/dtos/report.dto';
import { ApproveReportDto } from 'src/dtos/approve-report.dto';
import { GetEstimationDto } from 'src/dtos/get-estimation.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @currentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.update(parseInt(id), body.approved);
  }

  @Get()
  getEstimation(@Query() query: GetEstimationDto) {
    return this.reportService.makeEstimation(query);
  }
}
