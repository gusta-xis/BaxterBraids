/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_PROVADOR_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
