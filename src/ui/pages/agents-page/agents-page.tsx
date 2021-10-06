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
import { Button, Icons } from "@drill4j/ui-kit";
import "twin.macro";

import { PageHeader, useSetPanelContext } from "components";
import { useAdminConnection } from "hooks";
import { Agent } from "types/agent";
import { ServiceGroup } from "types/service-group";
import { AgentsTable } from "./agents-table";

export const AgentsPage = () => {
  const setPanel = useSetPanelContext();
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const serviceGroups = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const agents = [
    ...serviceGroups.map((serviceGroup) => ({
      ...serviceGroup,
      agentType: "ServiceGroup",
      agents: agentsList.filter((agent) => agent.group === serviceGroup.id),
    })),
    ...agentsList.filter(({ group }) => !group),
  ];

  return (
    <div tw="flex flex-col flex-grow">
      <PageHeader
        title="Agents"
        itemsCount={agentsList.length}
        actions={(
          <Button secondary size="large" onClick={() => setPanel({ type: "OFFLINE_AGENT_PREREGISTRATION" })}>
            <Icons.Register />
            <span>Preregister Offline Agent</span>
          </Button>
        )}
      />
      <div tw="flex flex-row flex-grow flex-wrap m-6">
        <AgentsTable agents={agents} />
      </div>
    </div>
  );
};
