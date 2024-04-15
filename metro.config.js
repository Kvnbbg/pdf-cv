// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
    transformer,
    server,
    resolver
   } = await getDefaultConfig(__dirname);

  return {
    transformer: {
      ...transformer,
      babelTransformerPath: require.resolve('./custom-transformer'),
    },
    resolver: {
      ...resolver,
      sourceExts: [...sourceExts, 'ts', 'tsx'],
    },
    server: {
      ...server,
      enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
          console.log(`Received request for ${req.url}`);
          return middleware(req, res, next);
        };
      },
    },
    watchFolders: [
      __dirname + '/node_modules'
    ],
    resetCache: false,
  };
})();
