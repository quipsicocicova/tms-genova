import { defineConfig, loadEnv } from 'vite';
import { createContactHandler } from './server/contact.mjs';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'SMTP_'), ...process.env };
  const mount = server => { server.middlewares.use('/api/contact', createContactHandler(env)); };
  return { plugins: [{ name: 'local-contact-api', configureServer: mount, configurePreviewServer: mount }] };
});
