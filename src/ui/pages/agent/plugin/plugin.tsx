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
import "twin.macro";

import { useAdminConnection, usePluginUrls, useRouteParams } from "hooks";
import { Spinner, Stub, sendAlertEvent } from "@drill4j/ui-kit";
import { ActiveAgentsBuild } from "types";
import { BUILD_STATUS } from "common";

export const Plugin = () => {
  const { agentId, pluginId } = useRouteParams();
  const paths = usePluginUrls();
  const registeredAgentsBuilds = useAdminConnection<ActiveAgentsBuild[]>("/api/agents/build") || [];
  const { build: agentActiveBuild } = registeredAgentsBuilds.find(({ agentId: id }) => id === agentId) || {};

  useEffect(() => {
    if (!paths) return;
    const isPluginAlreadyRegistered = getAppNames().includes(getPluginName(pluginId));
    if (isPluginAlreadyRegistered) return;
    if (!paths[pluginId]) {
      sendAlertEvent({ type: "ERROR", title: "CRITICAL ERROR: Plugin URL is not exist. Check PLUGINS env variable value" });
      return;
    }
    registerAgentPlugin(pluginId, paths[pluginId]);

    // eslint-disable-next-line consistent-return
    return () => {
      unregisterApplication(getPluginName(pluginId));
    };
  }, [pluginId, paths]);

  return (
    <div tw="relative h-full">
      {agentActiveBuild?.buildStatus === BUILD_STATUS.BUSY && (
        <div tw="absolute inset-0 bg-monochrome-white bg-opacity-[0.95] z-[100]">
          <Stub icon={<Spinner color="blue" tw="!w-16 !h-16" />} title="Please wait" message="Agent is busy at the moment." />
        </div>
      )}
      <div tw="w-full h-full overflow-y-auto" id={pluginId} />
    </div>
  );
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
