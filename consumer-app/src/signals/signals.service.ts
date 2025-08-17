import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Signal } from './schemas/signal.schema';

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(@InjectModel(Signal.name) private signalModel: Model<Signal>) {}

  async saveFromXray(
    deviceId: string,
    time: number,
    data: any[],
  ): Promise<Signal> {
    const dataLength = Array.isArray(data) ? data.length : 0;
    const rawString = JSON.stringify(data);
    const dataVolume = Buffer.byteLength(rawString, 'utf8');

    const signal = new this.signalModel({
      deviceId,
      time,
      dataLength,
      dataVolume,
      raw: { data },
    });

    this.logger.log(
      `Persisting signal: deviceId=${deviceId} length=${dataLength} volume=${dataVolume}B`,
    );
    return signal.save();
  }

  async findAll(filter: FilterQuery<Signal> = {}): Promise<Signal[]> {
    return this.signalModel.find(filter).exec();
  }

  async findById(id: string): Promise<Signal | null> {
    return this.signalModel.findById(id).exec();
  }

  async update(id: string, dto: any): Promise<Signal | null> {
    return this.signalModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.signalModel.findByIdAndDelete(id).exec();
    return { deleted: !!res };
  }
}
