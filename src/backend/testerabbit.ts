import amqp from "amqplib";

async function test() {
  const conn = await amqp.connect("amqp://localhost:5672");
  const channel = await conn.createChannel();

  const exchange = "table_updates";
  await channel.assertExchange(exchange, "fanout", { durable: false });

  const msg = { test: "Hello RabbitMQ", timestamp: Date.now() };
  channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)));

  console.log("Mensagem enviada para RabbitMQ:", msg);
  await channel.close();
  await conn.close();
}

test();