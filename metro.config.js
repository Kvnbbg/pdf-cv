const { getDefaultConfig } = require('metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      // Enable the experimental new architecture (Fabric)
      experimentalImportSupport: false,
      inlineRequires: true, // Improve startup time
      // Apply custom transformations if necessary
      babelTransformerPath: require.resolve('custom-transformer'),
    },
    resolver: {
      // Define additional asset extensions
      assetExts: [...assetExts, 'md', 'custom'],
      // Define additional source file extensions
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
      // Custom server options
      enhanceMiddleware: (middleware) => {
        // Custom middleware for the Metro server
        return (req, res, next) => {
          // Custom code before passing to the next middleware
          console.log(`Received request for ${req.url}`);
          return middleware(req, res, next);
        };
      },
    },
    // Direct Metro to watch additional folders outside of the root folder
    watchFolders: [
      path.resolve(__dirname, '../shared'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    // Custom configuration to reset cache if needed
    resetCache: false, // Reset the Metro bundler cache
  };
})();
