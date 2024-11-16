const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  // Your existing extra node modules configuration
  config.resolver.extraNodeModules = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
  };

  // Add SVG support
  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  
  // Filter out SVG from asset extensions and add it to source extensions
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

  return config;
})();