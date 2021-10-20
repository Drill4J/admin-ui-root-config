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
import { Icons } from "@drill4j/ui-kit";
import { Link, matchPath, useLocation } from "react-router-dom";
import "twin.macro";

import {
  useAdminConnection, useRouteParams,
} from "hooks";
import { getPagePath, routes } from "common";
import { Plugin } from "types";
import { CubeWithTooltip } from "../cubes";
import { usePanelContext } from "../panels";

export const PluginsSelector = () => {
  const { agentId, groupId, buildVersion } = useRouteParams();
  const plugins = useAdminConnection<Plugin[]>(agentId ? `/agents/${agentId}/plugins` : `/groups/${groupId}/plugins`) || [];
  const { pathname } = useLocation();
  const selectedPanel = usePanelContext();
  const { params: { pluginId: selectedPluginId = "" } = {} } = matchPath<{
    pluginId?: string; }>(pathname, { path: [routes.agentPlugin, routes.serviceGroupPlugin] }) || {};

  if (!agentId && !groupId) {
    return <div />; // need that layout can display correct
  }

  return (
    <div tw="py-4 rounded bg-[#2F2D2F]">
      {plugins.map(({ name = "", id: pluginId = "" }) => {
        const Icon = Icons[name as keyof typeof Icons];
        const pageObject = agentId
          ? { name: "agentPlugin", params: { agentId, buildVersion, pluginId } }
          : { name: "serviceGroupPlugin", params: { groupId, pluginId } };

        return (
          <Link to={getPagePath(pageObject as any)} key={pluginId}>
            <CubeWithTooltip tooltip={name} isActive={selectedPluginId === pluginId && selectedPanel?.type !== "SELECT_AGENT"}>
              <Icon width={24} height={24} viewBox="0 0 24 24" />
            </CubeWithTooltip>
          </Link>
        );
      })}
    </div>
  );
};
