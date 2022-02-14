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
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "twin.macro";

import { LoginPage, PageSwitcher } from "pages";
import { TypographyStyles, LayoutStyles, FontsStyles } from "global-styles";
import { PanelProvider, Panels, Navigation } from "components";
import { configureAxios, routes } from "common";
import { SetPluginUrlModal } from "components/set-plugin-url-modal";
import { AlertManager } from "./alert-manager";
import "./index.css";
import { useAdminConnection } from "./hooks";
import { AnalyticsInfo } from "./types";

ReactGA.initialize("UA-220101809-1");
ReactGA.pageview(window.location.pathname + window.location.search);

configureAxios();

const Root = () => {
  const { clientId } = useAdminConnection<AnalyticsInfo>("/api/analytics/info") || {};

  useEffect(() => {
    ReactGA.set({ dimension1: clientId });
  }, [clientId]);

  return (
    <BrowserRouter>
      <FontsStyles />
      <TypographyStyles />
      <LayoutStyles />
      <AlertManager />
      <Switch>
        <Route exact path={routes.login} component={LoginPage} />
        <PanelProvider>
          <Navigation tw="fixed" />
          {/* Navigation width = 48px */}
          <div tw="ml-12 w-[calc(100% - 48px)]">
            <PageSwitcher />
          </div>
          <Panels />
        </PanelProvider>
      </Switch>
      <SetPluginUrlModal />
    </BrowserRouter>
  );
};

export default Root;
