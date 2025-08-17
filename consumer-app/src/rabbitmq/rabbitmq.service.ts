import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  connect,
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import type { ConfirmChannel } from 'amqplib';
import { SignalsService } from '../signals/signals.service';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection!: AmqpConnectionManager;
  private channel!: ChannelWrapper;

  constructor(private readonly signalsService: SignalsService) {}

  onModuleInit() {
    const url = process.env.RABBITMQ_URI!;
    const queue = process.env.RABBITMQ_QUEUE!;

    this.connection = connect([url]);
    this.channel = this.connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await channel.assertQueue(queue, { durable: true });
        await channel.consume(queue, async (msg) => {
          if (!msg) return;
          try {
            const parsed = JSON.parse(msg.content.toString('utf8'));
            const deviceId = Object.keys(parsed)[0];
            const root = parsed[deviceId];
            const { data, time } = root;

            await this.signalsService.saveFromXray(deviceId, time, data);

            channel.ack(msg);
          } catch (err) {
            this.logger.error(`Processing failed: ${err.message}`);
            channel.nack(msg, false, false);
          }
        });
      },
    });
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }
}
