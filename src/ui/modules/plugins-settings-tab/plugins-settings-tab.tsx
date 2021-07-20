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
import {
  matchPath, Route, useLocation, Link,
} from "react-router-dom";
import { Icons, Button, GeneralAlerts } from "@drill4j/ui-kit";
import "twin.macro";

import { PluginListEntry, Stub } from "components";
import { Agent } from "types/agent";
import { Plugin } from "types/plugin";
import { useAdminConnection } from "hooks";
import { getPagePath, routes } from "common";
import { AddPluginsModal } from "./add-plugins-modal";

interface Props {
  agent: Agent;
}

export const PluginsSettingsTab = ({ agent: { buildVersion = "" } }: Props) => {
  const { pathname } = useLocation();
  const { params: { agentId = "", groupId = "" } = {} } = matchPath<{ agentId?: string; groupId?: string; }>(pathname, {
    path: [routes.agentPluginsSettings, routes.serviceGroupPluginsSettings],
  }) || {};
  const pluginsTopic = agentId ? `/agents/${agentId}/plugins` : `/groups/${groupId}/plugins`;
  const plugins = useAdminConnection<Plugin[]>(pluginsTopic) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);

  return (
    <div tw="flex flex-col h-full w-full">
      <GeneralAlerts type="INFO">
        {`Installed plugins on your ${agentId ? "agent" : "service group"}.`}
      </GeneralAlerts>
      <div tw="flex justify-between pt-6 pb-6 mr-6 ml-6 text-20">
        <span>
          Plugins
          <span tw="ml-2 font-regular text-monochrome-default">{installedPlugins.length}</span>
        </span>
        <Link
          to={`${pathname}/add-plugin-modal`}
          data-test={`${agentId ? "agent" : "service-group"}-info-page:add-plugin-button`}
        >
          <Button
            tw="flex items-center justify-center gap-x-2 h-full pl-2 pr-2 text-14"
            secondary
          >
            <Icons.Add />
            Add plugin
          </Button>
        </Link>
      </div>
      <div tw="flex-grow mr-6 ml-6">
        {installedPlugins.length > 0 ? (
          installedPlugins.map(({
            id: pluginId = "", name, description, version,
          }) => (
            <Link
              to={agentId
                ? getPagePath({ name: "agentPlugin", params: { agentId, buildVersion, pluginId } })
                : getPagePath({ name: "serviceGroupPlugin", params: { groupId, pluginId } })}
              key={pluginId}
            >
              <PluginListEntry
                key={agentId || groupId}
                description={description}
                icon={name as keyof typeof Icons}
              >
                <div className="flex items-center w-full">
                  <div tw="font-bold text-14 leading-22 link">{name}&nbsp;</div>
                  {version && <div tw="text-14 leading-22 text-monochrome-default">({version})</div>}
                </div>
              </PluginListEntry>
            </Link>
          ))
        ) : (
          <Stub
            icon={<Icons.Plugins tw="text-monochrome-medium-tint" height={160} width={160} />}
            title={<span tw="text-24">No plugins installed</span>}
            message={`There are no plugins installed on this ${agentId ? "agent" : "service group"} at the moment.`}
          />
        )}
      </div>
      <Route
        path="*/add-plugin-modal"
        render={() => (
          <AddPluginsModal
            plugins={plugins}
            selectedPlugins={selectedPlugins}
            setSelectedPlugins={setSelectedPlugins}
          />
        )}
      />
    </div>
  );
};
