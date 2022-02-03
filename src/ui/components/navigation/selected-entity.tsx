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
import { Link, matchPath, useLocation } from "react-router-dom";
import "twin.macro";

import {
  useAdminConnection, useAgent, useGroup, useRouteParams,
} from "hooks";
import { getPagePath, routes } from "common";
import { convertAgentName } from "utils";
import { IndicatorInEdge } from "components/indicator-in-edge";
import { AgentBuildInfo } from "types";
import { CubeWithTooltip } from "../cubes";
import { AgentStatusBadge } from "../agent-status-badge";
import { usePanelContext } from "../panels";

interface Props {
  isSelectedPanelOpen?: boolean;
}

export const SelectedEntity = () => {
  const { agentId, groupId } = useRouteParams();
  const selectedPanel = usePanelContext();

  if (!agentId && !groupId) {
    return <div />; // need that layout can display correct
  }

  return agentId
    ? <SelectedAgent isSelectedPanelOpen={selectedPanel?.type === "SELECT_AGENT"} />
    : <SelectedGroup isSelectedPanelOpen={selectedPanel?.type === "SELECT_AGENT"} />;
};

const SelectedAgent = ({ isSelectedPanelOpen }: Props) => {
  const { name = "", id = "" } = useAgent();
  const [activeBuildInfo] = useAdminConnection<AgentBuildInfo[]>(`/api/agent/${id}/builds`) || [];
  const { pathname } = useLocation();
  const { isExact } = matchPath(pathname, { path: routes.agentDashboard }) || {};

  return (
    <Link tw="bg-monochrome-dark100 rounded" to={getPagePath({ name: "agentDashboard", params: { agentId: id } })}>
      <IndicatorInEdge
        tw="bottom-[3px] right-[3px]"
        isHidden={false}
        position="bottom-right"
        indicatorContent={<AgentStatusBadge status={activeBuildInfo?.buildStatus} />}
      >
        <CubeWithTooltip tooltip={name} isActive={isExact && !isSelectedPanelOpen} tw="text-14 text-monochrome-medium-tint">
          {convertAgentName(name)}
        </CubeWithTooltip>
      </IndicatorInEdge>
    </Link>
  );
};

const SelectedGroup = ({ isSelectedPanelOpen }: Props) => {
  const { name = "", id = "" } = useGroup();
  const { pathname } = useLocation();
  const { isExact } = matchPath(pathname, { path: routes.serviceGroupDashboard }) || {};

  return (
    <Link tw="bg-monochrome-dark100 rounded" to={getPagePath({ name: "serviceGroupDashboard", params: { groupId: id } })}>
      <CubeWithTooltip tooltip={name} isActive={isExact && !isSelectedPanelOpen} tw="text-14 text-monochrome-medium-tint">
        {convertAgentName(name)}
      </CubeWithTooltip>
    </Link>
  );
};
