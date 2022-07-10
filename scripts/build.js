const { nodeExternalsPlugin } = require('esbuild-node-externals');
const grabComponentsDirecrories = require('./grap-require.js');

const inputDirs = grabComponentsDirecrories('src');

require('esbuild').build({
  entryPoints: inputDirs,
  // chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  minify: true,
  format: 'cjs',
  outdir: './',
  plugins: [nodeExternalsPlugin({
    allowList: ['use-sync-external-store']
  })],
}).catch((error) => {
  console.log('Error', error);
  process.exit(1)
})
