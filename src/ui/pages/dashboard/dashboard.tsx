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
import singleSpaReact from "single-spa-react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import {
  Application, getAppNames, registerApplication, unregisterApplication,
} from "single-spa";
import { css } from "twin.macro";
import { Icons, Stub } from "@drill4j/ui-kit";

import { useAdminConnection, usePluginUrls } from "hooks";
import { Plugin } from "types";
import { HUD } from "components";
import { getPagePath, routes } from "common";

interface Props {
  id: string;
  buildVersion?: string;
  isGroup?: boolean;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <div tw="flex flex-col pt-5 px-6 h-full">
      <div tw="pb-7 text-24 leading-32 font-light border-b border-monochrome-medium-tint">Dashboard</div>
      {children}
    </div>
  </BrowserRouter>
);

const DashboardComponent = ({ id, isGroup, buildVersion = "" }: Props) => {
  const plugins = useAdminConnection<Plugin[]>(isGroup ? `/groups/${id}/plugins` : `/agents/${id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const paths = usePluginUrls();

  if (!paths) {
    return <Wrapper><div tw="w-full h-full "><Loader /></div></Wrapper>;
  }

  if (!installedPlugins.length) {
    return (
      <Wrapper>
        <Stub
          icon={<Icons.Plugins width={160} height={160} />}
          title="No data available"
          message={(
            <div>
              There are no enabled plugins on this {isGroup ? "service Group" : "agent"} to collect the data from.
              <br /> To install a plugin go to
              <Link
                tw="link block mt-1 font-bold"
                to={isGroup
                  ? getPagePath({ name: "serviceGroupGeneralSettings", params: { groupId: id } })
                  : getPagePath({ name: "agentGeneralSettings", params: { agentId: id } })}
              >
                {isGroup ? "Service Group" : "Agent"} settings page
              </Link>
            </div>
          )}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      { installedPlugins.map(({ id: pluginId = "" }) => {
        const hudPath = paths[pluginId];
        return (
          <HUD
            key={pluginId}
            url={hudPath}
            name={isGroup ? "GroupHUD" : "AgentHUD"}
            customProps={{
              pluginPagePath: isGroup
                ? getPagePath({ name: "serviceGroupPlugin", params: { groupId: id, pluginId } })
                : getPagePath({ name: "agentPlugin", params: { agentId: id, buildVersion, pluginId } }),
            }}
          />
        );
      })}
    </Wrapper>
  );
};

const DashboardLifecycle = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: DashboardComponent,
  domElementGetter: () => document.getElementById("dashboard") || document.body,
  errorBoundary: () => <div>smth went wrong</div>,
});

export const Dashboard = ({ id = "", buildVersion = "", isGroup = false }: Props) => {
  useEffect(() => {
    !getAppNames().includes(isGroup ? "group-dashboard" : "agent-dashboard") && registerApplication({
      name: isGroup ? "group-dashboard" : "agent-dashboard",
      app: ({
        mount: [
          DashboardLifecycle.mount,
        ],
        unmount: [
          DashboardLifecycle.unmount,
        ],
        update: DashboardLifecycle.update,
        bootstrap: DashboardLifecycle.bootstrap,
      } as Application),
      activeWhen: [routes.agentDashboard, routes.serviceGroupDashboard],
      customProps: { id, isGroup, buildVersion },
    });
    return () => {
      unregisterApplication(isGroup ? "group-dashboard" : "agent-dashboard");
    };
  }, []);

  return <div tw="w-full h-full" id="dashboard" />;
};

const loaderStyles = css`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 10px solid rgba(255, 255, 255, 0.1);
  border-top-color: #09d;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Loader = () => (
  <div tw="w-full h-full flex justify-center items-center"><div css={loaderStyles} /></div>
);
