import {sentryVitePlugin} from '@sentry/vite-plugin';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), sentryVitePlugin({
        org: 'spiritecosse',
        project: 'faithfishart-client',
        telemetry: false, // disable telemetry
    })],

    define: {
        'process.env': process.env,
        'import.meta.env.PROJECT_NAME': JSON.stringify('Faithfishart'),
    },

    server: {
        host: true,
    },

    base: './',

    build: {
        sourcemap: true
    }
});