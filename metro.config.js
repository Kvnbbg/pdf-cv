// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const setupMetro = require('./setup-metro');
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  // Execute any setup logic from setup-metro.js
  await setupMetro();
  // Add any additional configuration here

  // For example, to enable TypeScript support:
  const defaultConfig = await getDefaultConfig(__dirname);
  const {
    resolver: { sourceExts },
  } = defaultConfig;


  return {
    ...defaultConfig,
    resolver: {
      ...defaultConfig.resolver,
      sourceExts: [...sourceExts, 'ts', 'tsx'],
    },
  };
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