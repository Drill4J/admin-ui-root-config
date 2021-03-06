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
import { Link } from "react-router-dom";
import { Button, Icons, sendAlertEvent } from "@drill4j/ui-kit";
import "twin.macro";

import { AgentInfoWithSystemSetting, Plugin } from "types";
import { useAdminConnection } from "hooks";
import { PluginCard } from "components";
import { AGENT_STATUS, getPagePath } from "common";
import { addPluginToAgent, addPluginToGroup, addPluginToPreregisteredAgent } from "../../save-settings-api";

interface Props {
  agent: AgentInfoWithSystemSetting;
}

export const PluginsSettingsTab = ({ agent }: Props) => {
  const plugins = useAdminConnection<Plugin[]>(`/${agent.agentType === "Group" ? "groups" : "agents"}/${agent.id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const { id: agentId = "" } = agent;

  return (
    <div tw="w-full space-y-1">
      <div tw="flex justify-between text-14 leading-24 text-monochrome-gray">
        <span>{`Installed plugins on your ${agent.agentType === "Group" ? "Service Group" : "agent"}.`}</span>
        <span>{installedPlugins.length} of {plugins.length} installed</span>
      </div>
      {plugins.map(({
        name, id = "", version, description, available,
      }) => (
        <PluginCard
          key={id}
          name={name}
          version={version}
          icon={name as keyof typeof Icons}
          description={description}
          button={available
            ? (
              <Button
                onClick={async () => {
                  try {
                    await addPlugin(agent, id);
                    sendAlertEvent({ type: "SUCCESS", title: "Plugin has been added." });
                  } catch ({ response: { data: { message } = {} } = {} }) {
                    sendAlertEvent({
                      type: "ERROR",
                      title: "On-submit error. Server problem or operation could not be processed in real-time.",
                    });
                  }
                }}
                primary
                size="large"
                type="button"
              >
                Install
              </Button>
            )
            : (
              <Link
                to={getPagePath({ name: "agentPlugin", params: { agentId, pluginId: id } })}
                tw="link"
              >
                Go to Plugin
              </Link>
            )}
        />
      ))}
    </div>
  );
};

const addPlugin = (agent: AgentInfoWithSystemSetting, pluginId: string) => {
  if (agent.agentStatus === AGENT_STATUS.PREREGISTERED) {
    return addPluginToPreregisteredAgent(agent, pluginId);
  }

  if (agent.agentType === "Group") {
    return addPluginToGroup(agent.id, pluginId);
  }

  return addPluginToAgent(agent.id, pluginId);
};
