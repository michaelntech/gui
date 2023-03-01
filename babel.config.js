module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        'corejs': '3',
        'useBuiltIns': 'usage'
      }
    ],
    '@babel/preset-react'
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-transform-runtime']
};