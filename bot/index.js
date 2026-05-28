import express from "express";
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";
import pino from "pino";
import { Boom } from "@hapi/boom";

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

  sock.ev.on("connection.update", (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      console.log("📱 Scan QR:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      isReady = true;
      console.log("✅ BOT READY");
    }

    if (connection === "close") {
      isReady = false;

      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log("❌ BOT DISCONNECTED");

      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot();
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

/**
 * ======================
 * SEND INVITATION API (FIXED)
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

  // IMPORTANT: respond immediately
  res.status(202).json({
    success: true,
    message: "Invitation queued",
  });

  // background processing (non-blocking HTTP)
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
        } catch (err) {
          console.log("❌ FAILED SEND TO:", phone, err.message);
        }
      }

      console.log("✅ All invitations processed");
    } catch (err) {
      console.log("❌ BACKGROUND ERROR:", err);
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
app.listen(4001, () => {
  console.log("🚀 Bot running on http://localhost:4001");
  startBot();
});
