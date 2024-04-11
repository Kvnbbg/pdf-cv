module.exports = function(api) {
  api.cache(true); // Caches the computed configuration for faster rebuilds

  return {
    presets: [
      '@babel/preset-env',      // Transform modern JavaScript into widely compatible syntax
      '@babel/preset-react',    // Transform JSX into JavaScript
      'babel-preset-expo'       // Preset for Expo apps
    ],
    plugins: [
      '@babel/plugin-transform-runtime' // Reuse Babel's injected helper code to save on codesize.
    ]
  };
};
