export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Worker ?? ??? ?????? ?????
    if (url.pathname === "/") {
      return new Response("Telegram bot backend is online!");
    }

    // Telegram webhook endpoint
    if (url.pathname !== "/telegram-webhook") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Telegram webhook secret ?? ??????? ?????
    if (
      request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
      env.WEBHOOK_SECRET
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();
    const message = update.message;

    if (!message?.text || !message.chat?.id) {
      return new Response("OK");
    }

    let reply = "Bot eka online!";

    if (message.text === "/start") {
      reply = "Welcome! Bot backend eka wada.";
    } else if (message.text === "/help") {
      reply = "Available commands: /start, /help";
    }

    const result = await fetch(
      `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: reply
        })
      }
    );

    if (!result.ok) {
      console.error("Telegram API request failed");
      return new Response("Telegram API error", { status: 502 });
    }

    return new Response("OK");
  },

  async scheduled(controller, env, ctx) {
    // ?????? ????? ???? background task ?? ???? ?? ??????.
    console.log("Scheduled task ran:", controller.cron);
  }
};