import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import qrcode from "qrcode-terminal"
import handler from "./src/handler.js"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  })

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("📲 Escanea el QR")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("✅ Bot conectado correctamente")
    }

    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode

      console.log("❌ Conexión cerrada:", reason)

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconectando...")
        startBot()
      }
    }
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg.message) return

      await handler(sock, msg)

    } catch (e) {
      console.log("❌ Error en mensaje:", e)
    }
  })
}

startBot()
