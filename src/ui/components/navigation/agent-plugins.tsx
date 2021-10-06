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

import { useRouteParams, useAgent } from "hooks";
import { getPagePath, routes } from "common";
import { CubeWithTooltip } from "../cubes";

export const AgentPlugins = () => {
  const { agentId, buildVersion } = useRouteParams();
  const { pathname } = useLocation();
  const { params: { pluginId: selectedPluginId = "" } = {} } = matchPath<{
    pluginId?: string; }>(pathname, { path: routes.agentPlugin }) || {};
  const { plugins = [] } = useAgent(agentId);
  if (!agentId) {
    return <div />;
  }
  return (
    <div tw="py-4 rounded bg-[#2F2D2F]">
      {plugins.map(({ name = "", id = "" }) => {
        const Icon = Icons[name as keyof typeof Icons];

        return (
          <Link to={getPagePath({ name: "agentPlugin", params: { agentId, buildVersion, pluginId: id } })}>
            <CubeWithTooltip tooltip={name} isActive={selectedPluginId === id}>
              <Icon width={24} height={24} />
            </CubeWithTooltip>
          </Link>
        );
      })}
    </div>
  );
};
