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
import axios from "axios";
import { parsePackages } from "@drill4j/ui-kit";
import { AgentInfoWithSystemSetting } from "types";

export const saveSettingForPreregisteredAgent = async (values: AgentInfoWithSystemSetting) => {
  const {
    id,
    name,
    description,
    environment,
    plugins,
    systemSettings,
  } = values;

  return axios.post("/agents", {
    id,
    name,
    agentType: "JAVA",
    environment,
    description,
    plugins: plugins.map(({ id: pluginId }) => pluginId),
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(systemSettings?.packages as unknown as string).filter(Boolean),
    },
  });
};

export const addPluginToAgent = async (agentId: string, pluginId: string) => axios.post(`/agents/${agentId}/plugins`, { pluginId });
export const addPluginToGroup = async (groupId: string, pluginId: string) => axios.post(`/groups/${groupId}/plugins`, { pluginId });
export const addPluginToPreregisteredAgent = async (
  values: AgentInfoWithSystemSetting,
  pluginId: string,
) => saveSettingForPreregisteredAgent({ ...values, plugins: [...values.plugins, { id: pluginId }] });
