import dotenv from "dotenv";
import express from "express";
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";

import pino from "pino";
import { Boom } from "@hapi/boom";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

let sock;
let isReady = false;

/**
 * ======================
 * INIT BOT
 * ======================
 */
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
  });

  let pairingCodeRequested = false;

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    // Request pairing code when QR would appear (socket is ready)
    if (qr && !pairingCodeRequested && !sock.authState.creds.registered) {
      pairingCodeRequested = true;

      const phoneNumber = process.env.WHATSAPP_NUMBER;

      if (!phoneNumber) {
        console.error("❌ WHATSAPP_NUMBER is not set in .env");
        process.exit(1);
      }

      try {
        const code = await sock.requestPairingCode(phoneNumber);
        console.log("\n==================================");
        console.log("📱 PAIRING CODE:", code);
        console.log("==================================");
        console.log(
          "Enter this code in WhatsApp > Linked Devices > Link with phone number\n",
        );
      } catch (err) {
        console.error("❌ Failed to get pairing code:", err.message);
      }
    }

    if (connection === "open") {
      isReady = true;
      console.log("✅ BOT READY");
    }

    if (connection === "close") {
      isReady = false;

      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log("❌ BOT DISCONNECTED, code:", statusCode);

      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("🚫 Logged out. Delete auth_info folder and restart.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

/**
 * ======================
 * SEND INVITATION API
 * ======================
 */
app.post("/send-invitation", async (req, res) => {
  console.log("🔥 HIT /send-invitation");

  if (!isReady || !sock) {
    return res.status(503).json({
      success: false,
      message: "Bot not ready",
    });
  }

  const { event, phones, content } = req.body;

  if (!event || !Array.isArray(phones) || phones.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload",
    });
  }

  // Respond immediately, process in background
  res.status(202).json({
    success: true,
    message: "Invitation queued",
  });

  setImmediate(async () => {
    try {
      console.log("🚀 Processing invitations...");

      for (const phone of phones) {
        try {
          const jid = phone.replace(/\D/g, "") + "@s.whatsapp.net";

          console.log("📤 Sending to:", jid);

          const message = `
🎉 *Event Invitation*

*${event.name}*
${event.tagline}

> ${event.description}

📍 ${event.location}
🕛 From ${new Date(event.startAt).toLocaleString("id-ID")}
🕒 To ${new Date(event.endAt).toLocaleString("id-ID")}

📄 ${content}
          `.trim();

          await sock.sendMessage(jid, {
            image: event.bannerUrl ? { url: event.bannerUrl } : undefined,
            caption: message,
          });

          console.log("✅ Sent to:", jid);
        } catch (err) {
          console.error("❌ FAILED SEND TO:", phone, err.message);
        }
      }

      console.log("✅ All invitations processed");
    } catch (err) {
      console.error("❌ BACKGROUND ERROR:", err);
    }
  });
});

/**
 * ======================
 * HEALTH CHECK
 * ======================
 */
app.get("/health", (req, res) => {
  res.json({
    ready: isReady,
    connected: !!sock,
  });
});

/**
 * ======================
 * START
 * ======================
 */
app.listen(PORT, () => {
  console.log(`🚀 Bot running on port ${PORT}`);
  startBot();
});
