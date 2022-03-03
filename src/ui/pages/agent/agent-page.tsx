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
import { Route, Switch, useRouteMatch } from "react-router-dom";
import axios from "axios";
import "twin.macro";

import {
  useActiveBuild, useAdminConnection, useAgent, useRouteParams,
} from "hooks";
import { getRoutePath, routes } from "common";
import { AgentBuildInfo, Notification } from "types";
import { useSetPanelContext } from "components";
import { Icons } from "@drill4j/ui-kit";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";
import { DashboardHeader } from "./dashboard-header";

export const AgentPage = () => {
  const { agentId = "" } = useRouteParams();
  const agent = useAgent();
  const { systemSettings } = useActiveBuild(agent?.id) || {};
  const [activeBuildInfo] = useAdminConnection<AgentBuildInfo[]>(`/api/agent/${agent.id}/builds`) || [];
  const setPanel = useSetPanelContext();
  const notifications = useAdminConnection<Notification[]>("/notifications") || [];
  const newBuildNotifications =
    notifications.filter((notification) => notification.agentId === agentId && notification.type === "BUILD" && !notification.read) || [];

  const isDashboard = useRouteMatch(routes.agentDashboard)?.isExact;
  const { params } = useRouteMatch<any>(routes.agentPlugin + getRoutePath("/builds/:buildVersion")) || { params: {} };

  useEffect(() => {
    const readVersion = isDashboard ? activeBuildInfo?.buildVersion : params.buildVersion;
    filterNotificationForVersion(newBuildNotifications, readVersion)
      .forEach(notification => notification.id && readNotification(notification.id));
  }, [newBuildNotifications, activeBuildInfo, params]);

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

function filterNotificationForVersion(notifications: Notification[], version?: string) {
  return notifications.filter(notification => notification.message?.currentId === version);
}
