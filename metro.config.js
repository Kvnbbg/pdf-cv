// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const setupMetro = require('./setup-metro');

module.exports = (async () => {
  // Execute any setup logic from setup-metro.js
  await setupMetro();

  // After setup, proceed with the default Metro configuration
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts, assetExts },
  } = defaultConfig;

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      experimentalImportSupport: false, // Optionally set to true for enabling new JS features
      inlineRequires: true, // Improve startup time
      // Specify a custom transformer if needed (e.g., for Babel setup)
      babelTransformerPath: require.resolve('./custom-transformer'), // Adjust path as necessary
    },
    resolver: {
      ...defaultConfig.resolver,
      // Define or extend additional asset and source file extensions
      assetExts: [...assetExts, 'md', 'custom'],
      sourceExts: [...sourceExts, 'jsx', 'tsx', 'cjs'],
      // Exclude specific directories from the bundler
      blacklistRE: exclusionList([/excluded-folder\/.*/]),
      // Additional module resolve settings, like aliases
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) =>
            // Redirects dependencies referenced from the root folder to local node_modules
            path.join(process.cwd(), `node_modules/${name}`),
        }
      ),
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
      path.resolve(__dirname, '../shared'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    resetCache: false, // Optionally reset the Metro bundler cache
  };
})();