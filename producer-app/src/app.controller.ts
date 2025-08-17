import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send-xray')
  sendXray() {
    this.appService.sendSampleData();
    return { message: 'Sample x-ray data sent' };
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  sendXrayAutomatically() {
    this.appService.sendSampleData();
    return { message: 'Sample x-ray data sent automatically' };
  }
}
