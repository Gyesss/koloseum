import { findEventById } from "../repositories/event.repository.js";

export const sendInvitation = async (data, user) => {
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const event = await findEventById(data.eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const payload = {
    event,
    phones: data.phones,
    content: data.content,
  };

  try {
    const res = await fetch(
      `${process.env.INVITATION_API_URL}/send-invitation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const text = await res.text();

    console.log("🤖 BOT RESPONSE:", text);

    if (!res.ok) {
      throw new Error("Bot failed to process request");
    }

    return true;
  } catch (err) {
    console.log("❌ BOT ERROR:", err.message);
    throw new Error("Failed to send invitation to bot");
  }
};
