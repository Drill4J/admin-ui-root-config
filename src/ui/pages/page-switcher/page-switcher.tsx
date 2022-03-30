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
import React, { useEffect } from "react";
import { Switch, useHistory } from "react-router-dom";
import { AGENT_STATUS, getPagePath, routes } from "common";
import { NoAgentSelectedStub, NoAgentsRegisteredStub, PrivateRoute } from "components";
import { useAdminConnection, useRouteParams } from "hooks";
import { AgentInfo } from "types";
import { AgentPage } from "../agent";
import { ServiceGroup } from "../service-group";

export const PageSwitcher = () => {
  const { push } = useHistory();
  const { agentId, groupId } = useRouteParams();
  const agentsList = useAdminConnection<AgentInfo[]>("/api/agents");
  const isAllAgentsUnregistered = agentsList?.every((agentItem) => agentItem.agentStatus === AGENT_STATUS.NOT_REGISTERED);

  useEffect(() => {
    if (!agentId) return;
    if (!agentsList?.length) push(getPagePath({ name: "root" }));
    if (agentsList?.length && !agentsList.find(agentItem => agentItem.id === agentId)) {
      push(getPagePath({ name: "root" }));
    }
  }, [agentsList]);

  if (isAllAgentsUnregistered) {
    return <NoAgentsRegisteredStub />;
  }

  if (!agentId && !groupId) {
    return <NoAgentSelectedStub />;
  }

  return (
    <Switch>
      <PrivateRoute path={[routes.agentPlugin, routes.agentDashboard]} component={AgentPage} />
      <PrivateRoute
        path={[routes.serviceGroupPlugin, routes.serviceGroupDashboard]}
        component={ServiceGroup}
      />
    </Switch>
  );
};
