const express = require("express");
const amqp = require("amqplib");
const { WebSocketServer } = require("ws");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(express.json());

const RABBIT_URL = "amqp://localhost";
const EXCHANGE = "table_updates";

// WebSocket server
const wss = new WebSocketServer({ port: 8080 });

function broadcast(msg) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(msg));
    }
  });
}

// Publicar atualização via RabbitMQ
async function publishTableUpdate(msg) {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "fanout", { durable: false });
  channel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(msg)));

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 300);
}

// Consumir mensagens e enviar via WS + salvar no Firestore
async function consumeUpdates() {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE, "");

  channel.consume(
    q.queue,
    async (msg) => {
      if (!msg?.content) return;

      const data = JSON.parse(msg.content.toString());

      // 1) enviar para front via websockets
      broadcast(data);

      // 2) salvar Firestore
      await db.collection("notifications").add({
        sectionId: data.sectionId,
        rowIndex: data.rowIndex ?? null,
        type: data.type,
        rowData: data.rowData ?? null,
        timestamp: data.timestamp,
      });
    },
    { noAck: true }
  );
}

consumeUpdates();

// Endpoint para enviar atualização
app.post("/update-row", async (req, res) => {
  const { sectionId, rowIndex, type, rowData } = req.body;

  await publishTableUpdate({
    sectionId,
    rowIndex,
    type,
    rowData,
    timestamp: Date.now(),
  });

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log("Backend rodando na porta 3001");
});
