// setup-metro.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getDefaultConfig } = require('@expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const Metro = require('metro');

// Ensure necessary packages are installed
function ensureDependencies() {
  const requiredPackages = [
    '@babel/core',
    '@babel/cli',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/plugin-transform-runtime',
    // Add other packages as necessary
  ];

  console.log("Checking for required packages...");
  requiredPackages.forEach(packageName => {
    try {
      require.resolve(packageName);
    } catch (e) {
      console.log(`Installing ${packageName}...`);
      execSync(`npm install --save-dev ${packageName}`, { stdio: 'inherit' });
    }
  });
  console.log("All required packages are installed.");
}

// Automatically update Babel configuration if needed
function updateBabelConfig() {
  const babelConfigPath = path.join(process.cwd(), '.babelrc');
  const babelConfig = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": ["@babel/plugin-transform-runtime"]
  };

  console.log("Updating Babel configuration...");
  fs.writeFileSync(babelConfigPath, JSON.stringify(babelConfig, null, 2));
  console.log("Babel configuration updated.");
}

async function setupMetro() {
  ensureDependencies();
  updateBabelConfig();

  const { resolver: { sourceExts, assetExts } } = await getDefaultConfig();

  return {
    transformer: {
      experimentalImportSupport: false,
      inlineRequires: true,
      // Ensure 'custom-transformer' is installed and provide its path
      babelTransformerPath: require.resolve('./custom-transformer'),
    },
    resolver: {
      assetExts: [...assetExts, 'md', 'custom'],
      sourceExts: [...sourceExts, 'jsx', 'tsx', 'cjs'],
      blacklistRE: exclusionList([/excluded-folder\/.*/]),
      extraNodeModules: new Proxy({}, {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      }),
    },
    server: {
      enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
          console.log(`Received request for ${req.url}`);
          return middleware(req, res, next);
        };
      },
    },
    watchFolders: [
      path.resolve(__dirname, '../shared'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    resetCache: false,
  };
}

// Automatically run setup when this script is called directly
if (require.main === module) {
  setupMetro().then(config => {
    console.log("Metro setup completed.");
    // You can use the 'config' variable to start Metro with custom configuration
    // Start Metro with custom configuration
    Metro.runBuild(config);
  }).catch(error => {
    console.error("Failed to setup Metro:", error);
  });
}

module.exports = setupMetro;