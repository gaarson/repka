process.env.NODE_ENV = 'production';

const { nodeExternalsPlugin } = require('esbuild-node-externals');
const grabComponentsDirectories = require('./grap-require.js');

const inputDirs = grabComponentsDirectories('src');

require('esbuild').build({
  entryPoints: inputDirs,
  bundle: true,
  minify: true,
  format: 'cjs',
  outdir: '../',
  define: {'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')},
  plugins: [nodeExternalsPlugin({
    allowList: ['use-sync-external-store']
  })],
}).catch((error) => {
  console.log('Error', error);
  process.exit(1)
})
