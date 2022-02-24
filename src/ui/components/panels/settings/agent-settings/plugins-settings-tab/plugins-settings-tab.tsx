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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icons, Button, sendAlertEvent } from "@drill4j/ui-kit";
import { motion, useAnimation } from "framer-motion";
import "twin.macro";

import {
  AgentInfoWithSystemSetting, Plugin,
} from "types";
import { useAdminConnection } from "hooks";
import { PluginCard } from "components";
import { AGENT_STATUS, getPagePath } from "common";
import { addPluginToAgent, addPluginToGroup, addPluginToPreregisteredAgent } from "../../save-settings-api";

interface Props {
  agent: AgentInfoWithSystemSetting;
}

export const PluginsSettingsTab = ({ agent }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const plugins = useAdminConnection<Plugin[]>(`/${agent.agentType === "Group" ? "groups" : "agents"}/${agent.id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const { id: agentId = "" } = agent;

  return (
    <div tw="w-full space-y-1">
      <div tw="flex justify-between text-14 leading-24 text-monochrome-gray">
        <span>Installed plugins on your agent.</span>
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
              <MotionButton
                tw="w-full"
                animate={controls}
                onClick={async () => {
                  try {
                    // await addPlugin(agent, id);
                    controls.start({
                      width: 24,
                      height: 24,
                      padding: 0,
                      fontSize: "0",
                    });

                    await later(1000);
                    await controls.start({
                      backgroundColor: "#00b602",
                      borderColor: "#00b602",
                      width: "100%",
                      fontSize: "0",
                    });
                    // sendAlertEvent({ type: "SUCCESS", title: "Plugin has been added" });
                  } catch ({ response: { data: { message } = {} } = {} }) {
                    await controls.start({
                      backgroundColor: "#ee0000",
                      borderColor: "#ee0000",
                      width: "100%",
                      fontSize: "0",
                    });
                    sendAlertEvent({
                      type: "ERROR",
                      title: "On-submit error. Server problem or operation could not be processed in real-time",
                    });
                  }
                }}
                primary
                size="large"
                type="button"
              >
                Install
              </MotionButton>
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

function later(delay: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}

const MotionButton = motion(Button);
const addPlugin = (agent: AgentInfoWithSystemSetting, pluginId: string) => {
  if (agent.agentStatus === AGENT_STATUS.PREREGISTERED) {
    return addPluginToPreregisteredAgent(agent, pluginId);
  }

  if (agent.agentType === "Group") {
    return addPluginToGroup(agent.id, pluginId);
  }

  return addPluginToAgent(agent.id, pluginId);
};
