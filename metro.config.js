// metro.config.js
const { getDefaultConfig } = require('/metro-config');
const setupMetro = require('./setup-metro');

module.exports = (async () => {
  // Execute any setup logic from setup-metro.js
  await setupMetro();
  // Add any additional configuration here

  ;, For example, to enable TypeScript support:
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts },
  } = defaultConfig;

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('./custom-transformer'),
    },
    resolver: {
      ...defaultConfig.resolver,
      sourceExts: [...sourceExts, 'ts', 'tsx'],
    },
    server: {
      ...defaultConfig.server,
      // Customize server middleware if needed
      enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
          console.log(`Received request for ${req.url}`);
          return middleware(req, res, next);
        };
      },
    },
    // Specify additional folders for Metro to watch
    watchFolders: [
      path.resolve(__dirname, './node_modules'),
    ],
    resetCache: false, // Optionally reset the Metro bundler cache
  };
})();
