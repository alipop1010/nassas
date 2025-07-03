declare module '@vkontakte/vk-bridge' {
  export interface VKWebAppGetUserInfoResult {
    id: number;
    first_name: string;
    last_name: string;
    photo_50: string;
    photo_100: string;
    photo_200: string;
    sex: 0 | 1 | 2;
    city?: {
      id: number;
      title: string;
    };
    country?: {
      id: number;
      title: string;
    };
    timezone: number;
  }

  export interface VKWebAppInitOptions {
    [key: string]: unknown;
  }

  export interface VKWebAppInitResult {
    [key: string]: unknown;
  }

  const bridge: {
    send<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T>;
    subscribe(handler: (event: any) => void): void;
    unsubscribe(handler: (event: any) => void): void;
    supports(method: string): boolean;
  };

  export default bridge;
}