module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        // You can add production-specific Babel plugins here if needed.
      ],
    },
  },
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
