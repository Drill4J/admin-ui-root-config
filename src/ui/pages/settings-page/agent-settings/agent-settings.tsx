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
import { Icons, Tab } from "@drill4j/ui-kit";
import {
  Switch, Route, useLocation, matchPath, Link,
} from "react-router-dom";
import "twin.macro";

import { PageHeader } from "components";
import { useAdminConnection } from "hooks";
import { PluginsSettingsTab, SystemSettingsForm } from "modules";
import { Agent } from "types/agent";
import { getPagePath, routes } from "common";
import { GeneralSettingsForm } from "./general-settings-form";
import { JsSystemSettingsForm } from "./js-system-settings-form";
import { AgentStatusToggle } from "../../agents-page/agent-status-toggle";

export const AgentSettings = () => {
  const { pathname: path } = useLocation();
  const { params: { agentId = "", tab = "" } = {} } = matchPath<{ agentId: string; tab: string}>(path, {
    path: "/agents/:agentId/:tab",
  }) || {};

  const agent = useAdminConnection<Agent>(`/api/agents/${agentId}`) || {};
  const SystemSettings = agent.agentType === "Node.js" ? JsSystemSettingsForm : SystemSettingsForm;

  return (
    <div tw="flex flex-col w-full">
      <PageHeader
        title={(
          <div tw="flex gap-x-4 items-center pt-5 pb-7">
            <Icons.Settings tw="text-monochrome-default" height={20} width={20} />
            {agent.agentType} Agent Settings
            <AgentStatusToggle tw="mt-2 leading-20" agent={agent} />
          </div>
        )}
      />
      <div tw="px-6">
        <Link to={getPagePath({ name: "agentGeneralSettings", params: { agentId } })}>
          <Tab active={tab === "general-settings"}>General</Tab>
        </Link>
        <Link to={getPagePath({ name: "agentSystemSettings", params: { agentId } })}>
          <Tab active={tab === "system-settings"}>System</Tab>
        </Link>
        <Link to={getPagePath({ name: "agentPluginsSettings", params: { agentId } })}>
          <Tab active={tab === "plugins-settings"}>Plugins</Tab>
        </Link>
      </div>
      <Switch>
        <Route
          path={routes.agentSystemSettings}
          render={() => <SystemSettings agent={agent} />}
        />
        <Route
          path={routes.agentPluginsSettings}
          render={() => <PluginsSettingsTab agent={agent} />}
        />
        <Route
          path={routes.agentGeneralSettings}
          render={() => <GeneralSettingsForm agent={agent} />}
        />
      </Switch>
    </div>
  );
};
