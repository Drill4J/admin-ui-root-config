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
import "twin.macro";
import { Route, Switch } from "react-router-dom";

import { ServiceGroup as ServiceGroupType } from "types";
import { useAdminConnection, useRouteParams } from "hooks";
import { routes } from "common";
import { useSetPanelContext } from "components";
import { Icons } from "@drill4j/ui-kit";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";
import { DashboardHeader } from "../agent/dashboard-header";

export const ServiceGroup = () => {
  const { groupId = "" } = useRouteParams();
  const group = useAdminConnection<ServiceGroupType>(`/groups/${groupId}`) || {} as ServiceGroupType;
  const setPanel = useSetPanelContext();

  return (
    <div tw="flex flex-col w-full h-full">
      <Switch>
        <Route
          exact
          path={routes.serviceGroupDashboard}
          render={() => (
            <>
              <DashboardHeader data={group} icon={<Icons.ServiceGroup width={32} height={36} />} setPanel={setPanel} />
              <Dashboard data={group} isGroup setPanel={setPanel} />
            </>
          )}
        />
        <Route path={routes.serviceGroupPlugin} component={Plugin} />
      </Switch>
    </div>
  );
};
