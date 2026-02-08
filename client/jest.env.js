// Mocks import.meta.env for Vite environment variables in Jest
Object.defineProperty(global, 'importMeta', {
  value: { env: { VITE_API_URL: '' } },
  writable: true,
});
global.import = global.import || {};
global.import.meta = global.importMeta;
