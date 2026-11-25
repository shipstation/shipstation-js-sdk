import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'node22',
    dts: true,
    sourcemap: false,
    clean: true,
    treeshake: false,
    esbuildPlugins: [
        {
            /**
             * Keep package.json out of the bundle so the version is read at runtime
             * from the published package.json (updated by semantic-release after the build).
             */
            name: 'external-package-json',
            setup(build) {
                build.onResolve({ filter: /\/package\.json$/ }, () => ({
                    path: '../package.json',
                    external: true,
                }));
            },
        },
    ],
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.js' };
    },
});
