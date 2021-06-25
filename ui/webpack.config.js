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
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "Drill4J",
    projectName: "admin-ui",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    externals: ["single-spa"],
    plugins: [
      new Dotenv({
        path: "./.env.local",
      }),
    ],
    resolve: {
      alias: {
        types: path.resolve(__dirname, "src/types/"),
        hooks: path.resolve(__dirname, "src/hooks/"),
        components: path.resolve(__dirname, "src/components/"),
        connection: path.resolve(__dirname, "src/connection/"),
        pages: path.resolve(__dirname, "src/pages/"),
        common: path.resolve(__dirname, "src/common/"),
        layouts: path.resolve(__dirname, "src/layouts/"),
        "global-styles": path.resolve(__dirname, "src/global-styles/"),
        modules: path.resolve(__dirname, "src/modules/"),
        forms: path.resolve(__dirname, "src/forms/"),
        "notification-manager": path.resolve(
          __dirname,
          "src/notification-manager/",
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
