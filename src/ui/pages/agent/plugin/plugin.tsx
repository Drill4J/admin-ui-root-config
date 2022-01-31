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
import { getAppNames, registerApplication, unregisterApplication } from "single-spa";
import { useParams } from "react-router-dom";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import "twin.macro";

import { usePluginUrls } from "hooks";

export const Plugin = () => {
  const { pluginId } = useParams<{ pluginId: string; agentId: string; }>();
  const paths = usePluginUrls();

  useEffect(() => {
    if (!paths) return;
    const isPluginAlreadyRegistered = getAppNames().includes(getPluginName(pluginId));
    if (isPluginAlreadyRegistered) return;
    if (!paths[pluginId]) {
      sendNotificationEvent({ type: "ERROR", text: "CRITICAL ERROR: Plugin URL is not exist. Check PLUGINS env variable value" });
      return;
    }
    registerAgentPlugin(pluginId, paths[pluginId]);

    // eslint-disable-next-line consistent-return
    return () => {
      unregisterApplication(getPluginName(pluginId));
    };
  }, [pluginId, paths]);

  return <div tw="w-full h-full overflow-y-auto" id={pluginId} />;
};

const registerAgentPlugin = (pluginName: string, pluginPath: string) => {
  registerApplication({
    name: getPluginName(pluginName),
    app: async () => {
      const res = await System.import(pluginPath);
      return res.AgentPlugin;
    },
    activeWhen: (location) =>
      !location.pathname.includes("group") && location.pathname.includes(pluginName),
  });
};

const getPluginName = (pluginId: string) => `agent-plugin-${pluginId}`;
