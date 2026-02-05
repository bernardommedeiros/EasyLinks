const express = require("express");
const amqp = require("amqplib");
const { WebSocketServer } = require("ws");
const admin = require("firebase-admin");
const cors = require("cors");
const dgram = require("dgram");
const net = require("net");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const serviceAccount = require("./serviceAccount.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("🔥 Firebase conectado");


function validateLinkTCP(url) {
  return new Promise((resolve) => {
    const client = new net.Socket();

    client.connect(4000, "127.0.0.1", () => {
      client.write(
        JSON.stringify({
          type: "VALIDATE_LINK",
          url,
        })
      );
    });

    client.on("data", (data) => {
      client.destroy();
      try {
        resolve(JSON.parse(data.toString()))
      } catch {
        resolve({ valid: false })
      }
    });

    client.on("error", () => {
      resolve({ valid: false })
    });
  });
}

const UDP_HOST = "127.0.0.1"
const UDP_PORT = 5000

function sendUdp(command) {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket("udp4")

    const timeout = setTimeout(() => {
      client.close();
      reject(new Error("udp_timeout"))
    }, 2000)

    client.send(Buffer.from(command), UDP_PORT, UDP_HOST)

    client.on("message", (msg) => {
      clearTimeout(timeout);
      client.close();
      resolve(JSON.parse(msg.toString()))
    })
  })
}

app.get("/metrics/ping", async (_, res) => {
  try {
    res.json(await sendUdp("PING"));
  } catch {
    res.status(500).json({ pong: false })
  }
})

app.get("/metrics", async (_, res) => {
  try {
    res.json(await sendUdp("METRICS"));
  } catch {
    res.status(500).json({ error: "metrics_unavailable" })
  }
});

app.get("/metrics/:sectionId", async (req, res) => {
  try {
    res.json(await sendUdp(`SECTION_METRICS:${req.params.sectionId}`))
  } catch {
    res.status(500).json({ error: "section_metrics_unavailable" })
  }
});

const RABBIT_URL = "amqp://localhost:5672"
const EXCHANGE = "table_updates"

let rabbitChannel = null;

const wss = new WebSocketServer({
  port: 8080,
  host: "0.0.0.0",
});

function broadcast(msg) {
  const str = JSON.stringify(msg)
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(str)
  });
}

async function connectRabbit() {
  if (rabbitChannel) return;

  while (true) {
    try {
      const conn = await amqp.connect(RABBIT_URL)
      rabbitChannel = await conn.createChannel()
      await rabbitChannel.assertExchange(EXCHANGE, "fanout", { durable: false })
      console.log("🐰 RabbitMQ conectado");
      return;
    } catch {
      console.log("RabbitMQ indisponível, tentando novamente...");
      await new Promise((r) => setTimeout(r, 3000))
    }
  }
}

async function consumeUpdates() {
  await connectRabbit();

  const q = await rabbitChannel.assertQueue("table_updates_queue", {
    durable: true,
  });

  await rabbitChannel.bindQueue(q.queue, EXCHANGE, "")

  rabbitChannel.consume(
    q.queue,
    async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString())
      broadcast(data);

      try {
        await db.collection("notifications").add(data)
      } catch {}
    },
    { noAck: true }
  );
}

function cleanUndefined(obj) {
  const out = {};
  for (const k in obj) if (obj[k] != null) out[k] = obj[k]
  return out;
}

function buildDiff(before, after) {
  const diff = {};
  for (const k in after) {
    if (before[k] !== after[k]) {
      diff[k] = { before: before[k], after: after[k] }
    }
  }
  return diff;
}

app.post("/update-row", async (req, res) => {
  const { sectionId, rowIndex, type, rowData } = req.body

  if (rowData?.link) {
    const validation = await validateLinkTCP(rowData.link)
    if (!validation.valid) {
      return res.status(400).json({
        error: "invalid_link",
        reason: validation.error,
      });
    }
  }


  try {
    const sectionRef = db.collection("sections").doc(sectionId)
    const sectionSnap = await sectionRef.get()

    if (!sectionSnap.exists) {
      return res.status(404).json({ error: "section_not_found" })
    }

    const sectionData = sectionSnap.data()
    const sectionName = sectionData?.title || null

    const rowsRef = db.collection("sectionRows").doc(sectionId)
    const rowsSnap = await rowsRef.get();
    const rowsData = rowsSnap.exists ? rowsSnap.data() : { rows: [] }
    const rows = rowsData.rows || [];

    const beforeRaw = rows[rowIndex] || null;
    const before = beforeRaw ? cleanUndefined(beforeRaw) : null;
    const after = cleanUndefined(rowData);

    if (type === "add") {
      rows.push(after);
    } else if (type === "delete") {
      if (rowIndex >= 0 && rowIndex < rows.length) {
        rows.splice(rowIndex, 1)
      }
    } else {
      if (rowIndex >= 0 && rowIndex <= rows.length) {
         rows[rowIndex] = after
      }
    }

    await rowsRef.set({ rows })

    const diff = before ? buildDiff(before, after) : {}

    const msg = {
      type,
      sectionId,
      sectionName,
      rowIndex,
      oldRowData: before,
      newRowData: after,
      changedField: Object.keys(diff)[0] || null,
      timestamp: Date.now(),
    };

    if (rabbitChannel) {
      rabbitChannel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(msg)))
    }

    res.json({ success: true });
  } catch (err) {
    console.error("update-row error:", err)
    res.status(500).json({ error: "failed" })
  }
});

app.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Gateway em http://192.168.15.116:3001")
});

consumeUpdates()
