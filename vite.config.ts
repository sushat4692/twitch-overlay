import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        glsl(),
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['babel-plugin-macros', '@emotion/babel-plugin'],
            },
        }),
    ],
});
