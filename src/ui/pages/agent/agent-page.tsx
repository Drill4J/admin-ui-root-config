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
import { Route, Switch, useParams } from "react-router-dom";
import axios from "axios";
import "twin.macro";

import { useActiveBuild, useAdminConnection, useAgent } from "hooks";
import { routes } from "common";
import { AgentBuildInfo, Notification } from "types";
import { useSetPanelContext } from "components";
import { Icons } from "@drill4j/ui-kit";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";
import { DashboardHeader } from "./dashboard-header";

export const AgentPage = () => {
  const { agentId = "", buildVersion = "" } =
    useParams<{ agentId?: string; buildVersion?: string }>();
  const agent = useAgent();
  const { systemSettings } = useActiveBuild(agent?.id) || {};
  const [activeBuildInfo] = useAdminConnection<AgentBuildInfo[]>(`/api/agent/${agent.id}/builds`) || [];
  const setPanel = useSetPanelContext();
  const notifications =
    useAdminConnection<Notification[]>("/notifications") || [];
  const newBuildNotification =
    notifications.find((notification) => notification.agentId === agentId) ||
    {};
  useEffect(() => {
    if (
      !newBuildNotification?.read &&
      newBuildNotification?.agentId === agentId &&
      newBuildNotification?.message?.currentId === buildVersion &&
      newBuildNotification?.id
    ) {
      readNotification(newBuildNotification.id);
    }
  }, [buildVersion, newBuildNotification?.id]);

  return (
    <div tw="flex flex-col w-full">
      <Switch>
        <Route
          exact
          path={routes.agentDashboard}
          render={() => (
            <>
              <DashboardHeader
                data={{ ...agent, systemSettings }}
                status={activeBuildInfo?.buildStatus}
                icon={<Icons.Agent width={32} height={36} />}
                setPanel={setPanel}
              />
              <Dashboard id={agentId} setPanel={setPanel} />
            </>
          )}
        />
        <Route path={routes.agentPlugin} component={Plugin} />
      </Switch>
    </div>
  );
};

async function readNotification(
  notificationId: string,
  {
    onSuccess,
    onError,
  }: { onSuccess?: () => void; onError?: (message: string) => void } = {},
) {
  try {
    await axios.patch(`/notifications/${notificationId}/read`);
    onSuccess && onSuccess();
  } catch ({ response: { data: { message } = {} } = {} }) {
    onError && onError(message as string);
  }
}
