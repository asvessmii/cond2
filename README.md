# Conditioner Miniapp

This project is a sample Telegram WebApp built with Next.js. It allows customers to place orders and send feedback.

## Environment variables

Create a `.env.local` file and provide the following variables:

```
BOT_TOKEN=your_bot_token_here
# Either OWNER_CHAT_ID or ADMIN_USER_ID will be used
OWNER_CHAT_ID=your_personal_telegram_id
ADMIN_USER_ID=
```

`*.local` files are ignored by git, so your token won't be committed by mistake.

`BOT_TOKEN` is the token of your Telegram bot. `OWNER_CHAT_ID` (or `ADMIN_USER_ID`) must contain the Telegram ID where order and feedback notifications should be sent. The webhook will fail if neither variable is provided.

After editing the environment file, restart the Next.js server so the new variables are picked up.

Run the development server with:

```
npm install
npm run dev
```

Make sure the Telegram bot webhook points to `<your-host>/api/webhook`.
The endpoint must be publicly reachable by Telegram. During local development you
can expose your machine using a tunneling service (for example `ngrok`):

```bash
ngrok http 3000
```

Then configure the webhook with your bot token and the public URL printed by
`ngrok`:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<public-url>/api/webhook"
```
