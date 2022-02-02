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
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import { getAppNames, registerApplication } from "single-spa";
import "twin.macro";

import { getPagePath } from "common";
import { usePluginUrls } from "hooks";
import { useSetPanelContext } from "components";
import { Agent } from "types";

export const Plugin = () => {
  const { pluginId } = useParams<{ pluginId: string; }>();
  const paths = usePluginUrls();
  const setPanel = useSetPanelContext();

  useEffect(() => {
    if (!paths) return;
    const isPluginAlreadyRegistered = getAppNames().includes(getPluginName(pluginId));
    if (isPluginAlreadyRegistered) return;
    if (!paths[pluginId]) {
      sendNotificationEvent({ type: "ERROR", text: "CRITICAL ERROR: Plugin URL is not exist. Check PLUGINS env variable value" });
      return;
    }
    registerAgentPlugin(pluginId, paths[pluginId], {
      getAgentPluginPath: ({ agentId, path = "" }:
      { agentId: string; buildVersion: string; path?: string }) => `${getPagePath(
        { name: "agentPlugin", params: { agentId, pluginId } },
      )}${path}`,
      getAgentDashboardPath: ({ agentId }: { agentId: string; }) => getPagePath(
        { name: "agentDashboard", params: { agentId } },
      ),
      openSettingsPanel: (agent: Agent) => setPanel({ type: "SETTINGS", payload: agent }),
    });
  }, [pluginId, paths]);

  return <div tw="w-full h-full px-6" id={pluginId} />;
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
