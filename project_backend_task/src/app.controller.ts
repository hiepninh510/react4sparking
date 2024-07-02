import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAllTask(): Promise<any> {
    return this.appService.findAllTask();
  }

  getHello(): string {
    return this.appService.getHello();
  }
}
