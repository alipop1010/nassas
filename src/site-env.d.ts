/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_NASA_API_KEY: string;
    readonly VITE_VK_APP_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}