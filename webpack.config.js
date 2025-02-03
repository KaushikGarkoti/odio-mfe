const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const printCompilationMessage = require('./compilation.config.js');


module.exports = (_, argv) => ({
  output: {
    publicPath: "auto",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
        '@constants': path.resolve(__dirname, 'src/constants'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@assets': path.resolve(__dirname, 'src/assets')
    }
  },

  devServer: {
    port: 3002,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      '/api': {
        target: 'http://65.108.148.94/',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug', 
        pathRewrite: { '^/api': '' },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader("Origin", "http://localhost:3000");
        },
      },
    },
},

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "odio_v2_dashboard",
      filename: "remoteEntry.js",
      remotes: {
      },
      exposes: {
          "./DashboardSales": "./src/components/Dashboard/DashboardSales.js",
          "./DashboardSupport": "./src/components/Dashboard/DashboardSupport.js"
      },
      shared: {
        react: { singleton: true, requiredVersion: "^17.0.2" },
        "react-dom": { singleton: true, requiredVersion: "^17.0.2" },
        'react-redux': { singleton: true },
        'react-router-dom': {singleton: true, requiredVersion: "^5.2.1"},
        "axios": {requiredVersion: "^0.24.0"},

      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],
});
