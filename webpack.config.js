/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "Drill4J";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "admin-ui-container",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    externals: ["single-spa"],
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        favicon: "src/favicon.ico",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
      new Dotenv({
        path: "./.env.local",
      }),
      new NodePolyfillPlugin(),
    ],
    resolve: {
      alias: {
        types: path.resolve(__dirname, "src/ui/types/"),
        hooks: path.resolve(__dirname, "src/ui/hooks/"),
        components: path.resolve(__dirname, "src/ui/components/"),
        connection: path.resolve(__dirname, "src/ui/connection/"),
        pages: path.resolve(__dirname, "src/ui/pages/"),
        common: path.resolve(__dirname, "src/ui/common/"),
        layouts: path.resolve(__dirname, "src/ui/layouts/"),
        "global-styles": path.resolve(__dirname, "src/ui/global-styles/"),
        modules: path.resolve(__dirname, "src/ui/modules/"),
        forms: path.resolve(__dirname, "src/ui/forms/"),
        "notification-manager": path.resolve(
          __dirname,
          "src/ui/notification-manager/",
        ),
      },
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2)$/,
          use: {
            loader: "url-loader",
          },
        },
      ],
    },
  });
};
