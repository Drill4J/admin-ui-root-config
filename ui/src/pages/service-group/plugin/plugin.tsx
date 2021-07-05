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
import { useParams } from "react-router-dom";
import "twin.macro";

import { getPagePath } from "common";
import { getAppNames, registerApplication } from "single-spa";
import { paths } from "../../../containers-paths";

export const Plugin = () => {
  const { pluginId } = useParams<{ pluginId: string; }>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !getAppNames().includes(getPluginName(pluginId)) && paths[pluginId] && registerAgentPlugin(pluginId, paths[pluginId], {
      getAgentPluginPath: ({ agentId, buildVersion, path = "" }:
      { agentId: string; buildVersion: string; path?: string }) => `${getPagePath(
        { name: "agentPlugin", params: { agentId, buildVersion, pluginId } },
      )}${path}`,
      getAgentDashboardPath: ({ agentId, buildVersion }:
      { agentId: string; buildVersion: string; }) => getPagePath(
        { name: "agentDashboard", params: { agentId, buildVersion } },
      ),
      getAgentSettingsPath: (agentId: string) => getPagePath({ name: "agentGeneralSettings", params: { agentId } }),
    });
  }, [pluginId]);

  return <div tw="w-full h-full" id={pluginId} />;
};

const registerAgentPlugin = (pluginName: string, pluginPath: string, customProps: any) => {
  registerApplication({
    name: getPluginName(pluginName),
    app: async () => {
      const res = await System.import(pluginPath);
      return res.GroupPlugin;
    },
    activeWhen: (location) =>
      location.pathname.includes("group") && location.pathname.includes(pluginName),
    customProps,
  });
};

const getPluginName = (pluginId: string) => `group-plugin-${pluginId}`;
