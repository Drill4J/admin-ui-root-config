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
import { CubeWithTooltip } from "../cubes";
import { usePanelContext, useSetPanelContext } from "./panel-context";
import { useAgentRouteParams } from "../../hooks";

export const SelectAgent = () => {
  const setPanel = useSetPanelContext();
  const activePanel = usePanelContext();
  const { groupId, agentId } = useAgentRouteParams();
  return (
    <CubeWithTooltip
      tooltip="Select Agent"
      isActive={activePanel?.type === "SELECT_AGENT"}
      onClick={() => setPanel({ type: "SELECT_AGENT" })}
    >
      {groupId && <Icons.ServiceGroup />}
      {agentId && <Icons.Agent /> }
    </CubeWithTooltip>
  );
};
