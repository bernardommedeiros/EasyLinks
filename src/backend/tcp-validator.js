const net = require("net");

const PORT = 4000

function isValidUrl(url) {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    try {
      const msg = JSON.parse(data.toString())

      if (msg.type !== "VALIDATE_LINK") {
        socket.write(JSON.stringify({ valid: false, error: "invalid_type" }))
        return
      }

      const { url } = msg

      if (!url || typeof url !== "string") {
        socket.write(JSON.stringify({ valid: false, error: "invalid_payload" }))
        return
      }

      if (!isValidUrl(url)) {
        socket.write(
          JSON.stringify({
            valid: false,
            error: "invalid_url",
          })
        )
        return
      }

      socket.write(JSON.stringify({ valid: true }))
    } catch {
      socket.write(JSON.stringify({ valid: false, error: "parse_error" }))
    }
  })
})

server.listen(PORT, () => {
  console.log("🔐 TCP Validator rodando na porta", PORT)
})