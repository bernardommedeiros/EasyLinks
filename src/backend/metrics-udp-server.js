const dgram = require("dgram");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
console.log("🔥 Firebase conectado (UDP Metrics)");

const server = dgram.createSocket("udp4");
const PORT = 5000;

server.on("listening", () => {
  console.log(`📡 UDP Metrics Server rodando na porta ${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Erro UDP:", err);
  server.close();
});

server.on("message", async (msg, rinfo) => {
  const command = msg.toString().trim();

  try {
    /* =======================
       PING
    ======================= */
    if (command === "PING") {
      return server.send(
        Buffer.from(JSON.stringify({ pong: true, timestamp: Date.now() })),
        rinfo.port,
        rinfo.address
      );
    }

    /* =======================
       MÉTRICAS GLOBAIS
    ======================= */
    if (command === "METRICS") {
      const snap = await db.collection("stats").doc("global").get();
      const data = snap.exists ? snap.data() : {};

      return server.send(
        Buffer.from(
          JSON.stringify({
            totalLinks: data.totalLinks ?? 0,
            totalTags: data.totalTags ?? 0,
            totalUsers: data.totalUsers ?? 0,
            totalAccesses: data.totalAccesses ?? 0,
            timestamp: Date.now(),
          })
        ),
        rinfo.port,
        rinfo.address
      );
    }

    /* =======================
       MÉTRICAS POR SEÇÃO
    ======================= */
    if (command.startsWith("SECTION_METRICS:")) {
      const sectionId = command.split(":")[1];

      if (!sectionId) {
        return server.send(
          Buffer.from(JSON.stringify({ error: "invalid_section_id" })),
          rinfo.port,
          rinfo.address
        );
      }

      const snap = await db
        .collection("stats")
        .doc("sections")
        .collection("data")
        .doc(sectionId)
        .get();

      if (!snap.exists) {
        return server.send(
          Buffer.from(
            JSON.stringify({
              totalLinks: 0,
              totalTags: 0,
              totalUsers: 0,
              totalAccesses: 0,
              timestamp: Date.now(),
            })
          ),
          rinfo.port,
          rinfo.address
        );
      }

      const data = snap.data();

      return server.send(
        Buffer.from(
          JSON.stringify({
            totalLinks: data.totalLinks ?? 0,
            totalTags: data.totalTags ?? 0,
            totalUsers: data.totalUsers ?? 0,
            totalAccesses: data.totalAccesses ?? 0,
            timestamp: Date.now(),
          })
        ),
        rinfo.port,
        rinfo.address
      );
    }

    /* =======================
       COMANDO DESCONHECIDO
    ======================= */
    server.send(
      Buffer.from(JSON.stringify({ error: "unknown_command" })),
      rinfo.port,
      rinfo.address
    );

  } catch (err) {
    console.error("❌ Erro ao processar comando UDP:", err);

    server.send(
      Buffer.from(JSON.stringify({ error: "internal_error" })),
      rinfo.port,
      rinfo.address
    );
  }
});

server.bind(PORT);
