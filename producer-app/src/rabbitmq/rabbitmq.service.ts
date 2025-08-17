import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URI);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(process.env.RABBITMQ_QUEUE, {
      durable: true,
    });
    console.log(`Connected to RabbitMQ, queue: ${process.env.RABBITMQ_QUEUE}`);
  }

  sendMessage(message: any) {
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(process.env.RABBITMQ_QUEUE, buffer, {
      persistent: true,
    });
    console.log('Message sent to queue:', message);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
