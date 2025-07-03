export {};

declare global {
  interface Window {
    mockVK?: {
      VKWebAppGetUserInfo?: () => Promise<{
        id: number;
        first_name: string;
        last_name: string;
      }>;
    };
  }
}