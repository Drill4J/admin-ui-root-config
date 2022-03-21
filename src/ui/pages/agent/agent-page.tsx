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
import { Route, Switch } from "react-router-dom";
import "twin.macro";

import { useActiveBuild, useAdminConnection, useAgent } from "hooks";
import { routes } from "common";
import { AgentBuildInfo } from "types";
import { useSetPanelContext } from "components";
import { Icons } from "@drill4j/ui-kit";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";
import { DashboardHeader } from "./dashboard-header";

export const AgentPage = () => {
  const agent = useAgent();
  const { systemSettings } = useActiveBuild(agent?.id) || {};
  const [activeBuildInfo] = useAdminConnection<AgentBuildInfo[]>(`/api/agent/${agent.id}/builds`) || [];
  const setPanel = useSetPanelContext();

  const agentWithSystemSettings = { ...agent, systemSettings };

  return (
    <div tw="flex flex-col flex-grow w-full h-full">
      <Switch>
        <Route
          exact
          path={routes.agentDashboard}
          render={() => (
            <>
              <DashboardHeader
                data={agentWithSystemSettings}
                status={activeBuildInfo?.buildStatus}
                icon={<Icons.Agent width={32} height={36} />}
                setPanel={setPanel}
              />
              <Dashboard data={agentWithSystemSettings} setPanel={setPanel} />
            </>
          )}
        />
        <Route path={routes.agentPlugin} component={Plugin} />
      </Switch>
    </div>
  );
};
