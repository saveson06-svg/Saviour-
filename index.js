import makeWASocket from "@whiskeysockets/baileys"
import qrcode from "qrcode-terminal"

async function startBot() {
  const sock = makeWASocket({
    printQRInTerminal: true
  })

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update
    if (qr) {
      qrcode.generate(qr, { small: true })
    }
    if (connection === "open") {
      console.log("✅ Bot connected!")
    }
  })

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

    // Example: simple alive command
    if (text.toLowerCase() === ".alive") {
      await sock.sendMessage(from, { text: "✅ I'm alive and running on Railway!" })
    }
  })
}

startBot()
