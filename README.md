# Conditioner Miniapp

This project is a sample Telegram WebApp built with Next.js. It allows customers to place orders and send feedback.

## Environment variables

Create a `.env.local` file and provide the following variables:

```
BOT_TOKEN=your_bot_token_here
OWNER_CHAT_ID=your_personal_telegram_id
```

`BOT_TOKEN` is the token of your Telegram bot. `OWNER_CHAT_ID` should be set to the Telegram ID where order and feedback notifications must be sent. Without these values the webhook will not be able to send messages.

Run the development server with:

```
npm install
npm run dev
```

Make sure the Telegram bot webhook points to `<your-host>/api/webhook`.
