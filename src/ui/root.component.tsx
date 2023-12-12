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
import { sendAlertEvent } from "@drill4j/ui-kit";
import "twin.macro";
import axios from "axios";

import { LoginPage, PageSwitcher } from "pages";
import { FontsStyles, LayoutStyles, TypographyStyles } from "global-styles";
import { Navigation, PanelProvider, Panels } from "components";
import { configureAxios, routes } from "common";
import { SetStatusColectOfAnalitycModal } from "analityc";
import { SetPluginUrlModal } from "components/set-plugin-url-modal";
import { UpdatePasswordModal } from "modules/auth/user-authentication/modal/update-password";
import { AlertManager } from "./alert-manager";
import "./index.css";
import { useAdminConnection } from "./hooks";
import { AnalyticsInfo } from "./types";

const analitycHandler = async (status: boolean) => {
  try {
    await axios.patch("/analytic/toggle", {
      disable: !status,
    });
  } catch (e) {
    sendAlertEvent({
      type: "ERROR",
      title: e.message,
    });
  }
};

configureAxios();

const Root = () => {
  const { clientId, isAnalyticsDisabled = true } = useAdminConnection<AnalyticsInfo>("/api/analytics/info") || {};

  useEffect(() => {
    if (!isAnalyticsDisabled) {
      ReactGA.initialize("UA-214931987-2");
      ReactGA.set({ anonymizeIp: true });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [isAnalyticsDisabled]);

  useEffect(() => {
    !isAnalyticsDisabled && ReactGA.set({ dimension1: clientId });
  }, [clientId, isAnalyticsDisabled]);

  return (
    <BrowserRouter>
      <FontsStyles />
      <TypographyStyles />
      <LayoutStyles />
      <AlertManager />
      <Switch>
        <Route exact path={routes.login} component={LoginPage} />
        <PanelProvider>
          <Navigation tw="fixed h-full" />
          {/* Navigation width = 48px */}
          <div tw="ml-12 w-[calc(100% - 48px)]">
            <PageSwitcher />
          </div>
          <Panels />
        </PanelProvider>
      </Switch>
      <SetPluginUrlModal />
      <SetStatusColectOfAnalitycModal submit={analitycHandler} isCollectOfAnalitycsData={!isAnalyticsDisabled} />
      <UpdatePasswordModal />
    </BrowserRouter>
  );
};

export default Root;
