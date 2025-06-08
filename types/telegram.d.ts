declare global {
  interface TelegramWebApp {
    expand(): void;
    sendData(data: string): void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export {};
