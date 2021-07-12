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
import {
  Application, getAppNames, registerApplication, unregisterApplication,
} from "single-spa";
import "twin.macro";

import { useAdminConnection } from "hooks";
import { Plugin } from "types";
import { HUD } from "components";
import { paths } from "../../containers-paths";
import { getPagePath } from "../../common";

interface Props {
  id: string;
  buildVersion?: string;
  isGroup?: boolean;
}

const DashboardComponent = ({ id, isGroup, buildVersion = "" }: Props) => {
  const plugins = useAdminConnection<Plugin[]>(isGroup ? `/groups/${id}/plugins` : `/agents/${id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);

  return (
    <div tw="mt-5 px-6">
      <div tw="mb-7 text-24 leading-32 font-light">Dashboard</div>
      {installedPlugins.map(({ id: pluginId = "" }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
    </div>
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
      activeWhen: (location) => {
        const isCorrectPage = isGroup ? location.pathname.includes("group") : !location.pathname.includes("group");
        // it need that on dashboard page both of dashboard not activate
        return isCorrectPage && !location.pathname.match("dashboard\\/\\w"); // "dashboard".length
      },
      customProps: { id, isGroup, buildVersion },
    });
    return () => {
      unregisterApplication(isGroup ? "group-dashboard" : "agent-dashboard");
    };
  }, []);

  return <div tw="w-full" id="dashboard" />;
};
