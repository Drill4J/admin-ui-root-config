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
import { Icons, Button, Tooltip } from "@drill4j/ui-kit";
import { Link } from "react-router-dom";

import "twin.macro";

import { AGENT_STATUS } from "common/constants";
import { ServiceGroupEntity } from "types/service-group-entity";
import { Agent } from "types/agent";
import { getPagePath } from "common";

interface ServiceGroup extends ServiceGroupEntity {
  name: string;
  agents: Agent[];
}

interface Props {
  agent: Agent;
}

export const ActionsColumn = ({ agent }: Props) => {
  const {
    id: agentId = "", status, agentType = "", group = "",
  } = agent;
  const { agents = [] } = agent as ServiceGroup;
  const unregisteredAgentsCount = agents.reduce(
    (acc, { status: agentStatus }) =>
      (agentStatus === AGENT_STATUS.NOT_REGISTERED ? acc + 1 : acc),
    0,
  );
  const hasOfflineAgent = agents.some(
    ({ status: agentStatus }) => agentStatus === AGENT_STATUS.OFFLINE,
  );
  const isJavaAgentsServiceGroup = agents.every(
    (serviceGroupAgent) => serviceGroupAgent.agentType === "Java",
  );

  return (
    <div className="flex items-center justify-end">
      {(status === AGENT_STATUS.NOT_REGISTERED ||
        unregisteredAgentsCount > 0) && (
        <Tooltip
          tw="mr-8"
          position="top-left"
          message={
            agentType === "ServiceGroup" &&
            !isJavaAgentsServiceGroup && (
              <div className="text-center">
                Bulk registration is disabled for multi-type agents.
                <br />
                Please register your agents separately.
              </div>
            )
          }
        >
          <Link
            to={agentType === "ServiceGroup"
              ? getPagePath({ name: "serviceGroupRegistration", params: { groupId: agentId } })
              : getPagePath({ name: "agentRegistration", params: { agentId } })}
          >
            <Button
              data-test="action-column:icons-register"
              primary
              size="small"
              {...(agentType === "ServiceGroup" || !group
                ? "primary"
                : "secondary")}
              disabled={
                agentType === "ServiceGroup" && !isJavaAgentsServiceGroup
              }
              tw="flex items-center w-full gap-x-2"
            >
              <Icons.Register />
              Register{" "}
              {unregisteredAgentsCount ? `(${unregisteredAgentsCount})` : ""}
            </Button>
          </Link>
        </Tooltip>
      )}
      {((status === AGENT_STATUS.ONLINE && agentType !== "ServiceGroup") ||
        (!hasOfflineAgent && !unregisteredAgentsCount && agentType === "ServiceGroup")) && (
        <Link
          to={agentType === "ServiceGroup"
            ? getPagePath({ name: "serviceGroupGeneralSettings", params: { groupId: agentId } })
            : getPagePath({ name: "agentGeneralSettings", params: { agentId } })}
          tw="link"
        >
          <Icons.Settings
            height={16}
            width={16}
            data-test="action-column:icons-settings"
          />
        </Link>
      )}
    </div>
  );
};
