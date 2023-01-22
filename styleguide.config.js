const { name, version, repository } = require('./package.json')
const { styles, theme } = require('./styleguide.styles')

module.exports = {
  title: `${name} v${version}`,
  ribbon: {
    url: repository,
    text: 'View on GitHub',
  },
  styles,
  theme,
  components: 'src/components/**/[A-Z]*.js',
  assetsDir: 'src/assets',
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader?name=/public/icons/[name].[ext]"
        }
      ],
    },
  },
}
