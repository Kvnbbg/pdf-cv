// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig(__dirname);

  return {
    transformer: {
      babelTransformerPath: require.resolve('./custom-transformer'),
    },
    resolver: {
      sourceExts: [...sourceExts, 'ts', 'tsx', 'js', 'jsx', 'json'],
      assetExts,
    },
  };
})();
