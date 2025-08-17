import { connect } from 'amqplib';

async function main() {
  const conn = await connect(
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672',
  );
  const ch = await conn.createChannel();
  const queue = process.env.RABBITMQ_QUEUE ?? 'xray.queue';
  await ch.assertQueue(queue, { durable: true });

  const payload = {
    '66bb584d4ae73e488c30a072': {
      data: [
        [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
        [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
        [2763, [51.339782, 12.339196166666667, 2.13906]],
      ],
      time: 1735683480000,
    },
  };

  ch.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
  await ch.close();
  await conn.close();
  console.log('Message sent');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
