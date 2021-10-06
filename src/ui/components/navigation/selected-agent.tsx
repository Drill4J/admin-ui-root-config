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
import { Tooltip } from "@drill4j/ui-kit";
import { Link } from "react-router-dom";
import "twin.macro";

import { useRouteParams } from "hooks/use-route-params";
import { useAgent } from "hooks";
import { getPagePath } from "common";
import { convertAgentName } from "utils";
import { CubeWithTooltip } from "../cubes";

export const SelectedAgent = () => {
  const { agentId } = useRouteParams();
  const { name = "", buildVersion = "" } = useAgent(agentId);

  if (!agentId) {
    return (
      <Tooltip message="No Agent selected" position="right">
        <span tw="flex justify-center items-center w-9 h-9 text-14 text-monochrome-medium-tint text-opacity-40">––</span>
      </Tooltip>
    );
  }

  return (
    <Link to={getPagePath({ name: "agentDashboard", params: { agentId, buildVersion } })}>
      <CubeWithTooltip tooltip={name} isActive tw="text-14 text-monochrome-medium-tint">
        {convertAgentName(name)}
      </CubeWithTooltip>
    </Link>
  );
};
