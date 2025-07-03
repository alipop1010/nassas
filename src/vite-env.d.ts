/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_NASA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}