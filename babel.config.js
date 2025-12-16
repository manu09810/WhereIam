module.exports = {
  presets: ['babel-preset-expo'], // or 'babel-preset-expo' for Expo
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
