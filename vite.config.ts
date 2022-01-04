import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), glsl()],
});
