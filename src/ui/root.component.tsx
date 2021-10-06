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
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "twin.macro";

import { LoginPage, PageSwitcher } from "pages";
import { TypographyStyles, LayoutStyles, FontsStyles } from "global-styles";
import { PanelProvider, Panels, Navigation } from "components";
import { configureAxios, routes } from "common";
import { SetPluginUrlModal } from "components/set-plugin-url-modal";
import { NotificationManager } from "./notification-manager";

import "./index.css";

configureAxios();

const Root = () => (
  <BrowserRouter>
    <FontsStyles />
    <TypographyStyles />
    <LayoutStyles />
    <NotificationManager />
    <Route exact path={routes.login} component={LoginPage} />
    <PanelProvider>
      <div tw="flex flex-row w-full h-full">
        <Navigation />
        <PageSwitcher />
      </div>
      <Panels />
    </PanelProvider>
    <SetPluginUrlModal />
  </BrowserRouter>
);

export default Root;
