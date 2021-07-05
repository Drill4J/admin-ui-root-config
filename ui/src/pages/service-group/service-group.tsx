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
import {
  useParams, Route, Link as LinkComponent, Switch,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";

import { Toolbar, Footer } from "components";
import { PluginsLayout } from "layouts";
import { Plugin as PluginType } from "types/plugin";
import { ServiceGroup as ServiceGroupType } from "types/service-group";
import { useAdminConnection } from "hooks";
import { Agent } from "types/agent";
import { getPagePath, routes } from "common";
import { ServiceGroupHeader } from "./service-group-header";
import { Sidebar, Link } from "../agent/sidebar";
import { Dashboard } from "../dashboard";
import { Plugin } from "./plugin";

const Breadcrumbs = () => (
  <LinkComponent tw="link" to={getPagePath({ name: "agentsTable" })}>Agents</LinkComponent>
);

export const ServiceGroup = () => {
  const { groupId = "" } = useParams<{ groupId: string, pluginId: string }>();
  const plugins = useAdminConnection<PluginType[]>(`/groups/${groupId}/plugins`) || [];
  const { name = "" } = useAdminConnection<ServiceGroupType>(`/groups/${groupId}`) || {};
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const agentCount = agentsList.filter((agent) => agent.group === groupId).length;

  const pluginsList: Link[] = [
    {
      id: "service-group-dashboard",
      name: "Dashboard",
      path: getPagePath({ name: "serviceGroupDashboard", params: { groupId } }),
    },
    ...plugins.map(({ id = "", name: pluginName = "" }) => ({
      id,
      name: pluginName as keyof typeof Icons,
      path: getPagePath({ name: "serviceGroupPlugin", params: { groupId, pluginId: id } }),
    })),
  ];

  return (
    <PluginsLayout
      sidebar={(
        <Sidebar
          links={pluginsList}
          matchParams={{ path: routes.serviceGroupDashboard }}
        />
      )}
      toolbar={<Toolbar breadcrumbs={<Breadcrumbs />} />}
      header={<ServiceGroupHeader name={name} agentsCount={agentCount} />}
      footer={<Footer />}
    >
      <div tw="w-full h-full">
        <Switch>
          <Route path={routes.serviceGroupPlugin} component={Plugin} />
          <Route path={routes.serviceGroupDashboard} render={() => <Dashboard id={groupId} isGroup />} />
        </Switch>
      </div>
    </PluginsLayout>
  );
};
