import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SignalsService } from './signals.service';
import { Signal } from './schemas/signal.schema';
import { GetSignalsDto } from './dto/request.dto';

@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  // CREATE
  @Post()
  async create(
    @Body() dto: { deviceId: string; time: number; data: any[] },
  ): Promise<Signal> {
    return this.signalsService.saveFromXray(dto.deviceId, dto.time, dto.data);
  }

  @Get()
  async findAll(@Query() query: GetSignalsDto): Promise<Signal[]> {
    const filter: Record<string, any> = {};

    if (query.deviceId) {
      filter.deviceId = query.deviceId;
    }

    return this.signalsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Signal | null> {
    return this.signalsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<{ deviceId: string; time: number; data: any[] }>,
  ): Promise<Signal | null> {
    return this.signalsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.signalsService.remove(id);
  }
}
