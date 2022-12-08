process.env.NODE_ENV = 'development';

const { nodeExternalsPlugin } = require('esbuild-node-externals');
const grabComponentsDirecrories = require('./grap-require.js');

const inputDirs = grabComponentsDirecrories('src');

require('esbuild').build({
  entryPoints: inputDirs,
  bundle: true,
  minify: false,
  format: 'cjs',
  outdir: './',
  watch: true,
  define: {'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')},
  plugins: [
    nodeExternalsPlugin({
      allowList: ['use-sync-external-store']
    })
  ],
}).catch((error) => {
  console.log('Error', error);
  process.exit(1)
}).then((result) => {
  // console.log(result);
  console.log('watching...');
});
