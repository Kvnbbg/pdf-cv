// setup-metro.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getDefaultConfig } = require('/metro-config');


// Function to ensure necessary packages are installed
function ensureDependencies() {
  const requiredPackages = [
    '@babel/core',
    '@babel/cli',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/plugin-transform-runtime',
    'metro-config',
    // Additional packages can be added here
  ];

  console.log("Checking for required packages...");
  requiredPackages.forEach(packageName => {
    if (!checkPackageInstalled(packageName)) {
      console.log(`Installing ${packageName}...`);
      execSync(`npm install --save-dev ${packageName}`, { stdio: 'inherit' });
    }
  });
  console.log("All required packages are installed.");
}

// Helper function to check if a package is installed
function checkPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to update Babel configuration
function updateBabelConfig() {
  const babelConfigPath = path.join(process.cwd(), '.babelrc');
  const babelConfig = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-transform-runtime"]
  };

  console.log("Updating Babel configuration...");
  fs.writeFileSync(babelConfigPath, JSON.stringify(babelConfig, null, 2));
  console.log("Babel configuration updated.");
}

// Main function to set up Metro configuration
async function setupMetro() {
  ensureDependencies();
  updateBabelConfig();

  const config = await getDefaultConfig();
  const { resolver: { sourceExts, assetExts } } = config;

  // Override the Metro configuration as needed
  return {
    ...config,
    transformer: {
      ...config.transformer,
      experimentalImportSupport: false,
      inlineRequires: true,
      babelTransformerPath: require.resolve('./custom-transformer'),
    },
    resolver: {
      ...config.resolver,
      assetExts: [...assetExts, 'md', 'custom'],
      sourceExts: [...sourceExts, 'jsx', 'tsx', 'cjs'],
      blacklistRE: exclusionList([/excluded-folder\/.*/]),
      extraNodeModules: new Proxy({}, {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`),
      }),
    },
    server: {
      ...config.server,
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

// Automatically run setup when this script is executed directly
if (require.main === module) {
  setupMetro().then(config => {
    console.log("Metro setup completed with the following configuration:", config);
  }).catch(error => {
    console.error("Failed to setup Metro:", error);
  });
}

module.exports = setupMetro;
