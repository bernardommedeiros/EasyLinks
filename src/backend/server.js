const express = require("express");
const amqp = require("amqplib");
const { WebSocketServer } = require("ws");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

let serviceAccount;
try {
  serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase ok");
} catch (err) {
  console.error("erro firebase:", err);
  process.exit(1);
}

const db = admin.firestore();

const RABBIT_URL = "amqp://guest:guest@10.24.12.252:5672";
const EXCHANGE = "table_updates";

let rabbitConnection = null;
let rabbitChannel = null;

console.log("Iniciando WebSocket na porta 8080…");

const wss = new WebSocketServer({ port: 8080, host: "0.0.0.0", });

wss.on("listening", () => {
  console.log("WebSocket rodando na 8080");
});

function broadcast(msg) {
  const str = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(str);
  });
}

async function connectRabbit() {
  if (rabbitChannel) return;

  while (true) {
    try {
      console.log("Conectando ao RabbitMQ em:", RABBIT_URL);

      rabbitConnection = await amqp.connect(RABBIT_URL);
      rabbitChannel = await rabbitConnection.createChannel();

      await rabbitChannel.assertExchange(EXCHANGE, "fanout", { durable: false });

      console.log("RabbitMQ conectado!");
      return;
    } catch (err) {
      console.error("❌ Erro conectando ao RabbitMQ. Tentando novamente em 3s…");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

function cleanUndefined(obj) {
  const cleaned = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

function buildDiff(beforeRow, afterRow) {
  const changedFields = {};
  for (const key in afterRow) {
    if (beforeRow[key] !== afterRow[key]) {
      changedFields[key] = {
        before: beforeRow[key],
        after: afterRow[key],
      };
    }
  }
  return changedFields;
}

let isWorkerRunning = false;

async function consumeUpdates() {
  if (isWorkerRunning) {
    console.log("Worker já está rodando. Ignorando segunda chamada.");
    return;
  }

  isWorkerRunning = true;

  await connectRabbit();

  const QUEUE_NAME = "table_updates_queue";

  const q = await rabbitChannel.assertQueue(QUEUE_NAME, { durable: true });
  await rabbitChannel.bindQueue(QUEUE_NAME, EXCHANGE, "");

  console.log("Worker ouvindo mensagens do RabbitMQ…");

  rabbitChannel.consume(
    q.queue,
    async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());

      broadcast(data);

      try {
        await db.collection("notifications").add(data);
      } catch (err) {
        console.error("Erro ao salvar no Firestore:", err);
      }
    },
    { noAck: true }
  );
}

async function publishTableUpdate(msg) {
  if (!rabbitChannel) await connectRabbit();
  rabbitChannel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(msg)));
}

app.post("/update-row", async (req, res) => {
  const { sectionId, rowIndex, type, rowData } = req.body;

  try {
    const sectionRef = db.collection("sections").doc(sectionId);
    const snap = await sectionRef.get();
    const sectionData = snap.data();
    const sectionName = sectionData?.title || null;


    if (!snap.exists) {
      return res.status(404).json({ error: "Section not found" });
    }

    const rows = snap.data().rows || [];

    const beforeRaw = rows[rowIndex] || null;

    const before = beforeRaw ? cleanUndefined(beforeRaw) : null;
    const after = cleanUndefined(rowData);

    rows[rowIndex] = after;

    await sectionRef.update({ rows });

    const changedFields = before ? buildDiff(before, after) : {};

    const msg = {
      type,
      sectionId,
      sectionName,
      rowIndex,
      oldRowData: before,
      newRowData: after,
      changedField: Object.keys(changedFields)[0] || null, 
      timestamp: Date.now(),
    };


    await publishTableUpdate(msg);

    res.json({ success: true });
  } catch (err) {
    console.error("Erro update-row:", err);
    res.status(500).json({ error: "failed" });
  }
});

app.listen(3001, "0.0.0.0", () => {
  console.log("REST na porta 3001");
});

consumeUpdates();
