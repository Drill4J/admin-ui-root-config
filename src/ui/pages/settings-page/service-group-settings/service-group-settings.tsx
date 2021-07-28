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
import {
  Switch, Route, matchPath, useLocation, Link,
} from "react-router-dom";
import { Icons, Tab } from "@drill4j/ui-kit";
import "twin.macro";

import { PageHeader } from "components";
import { PluginsSettingsTab, SystemSettingsForm } from "modules";
import { useAdminConnection } from "hooks";
import { ServiceGroupEntity } from "types/service-group-entity";
import { getPagePath, routes } from "common";
import { ServiceGroupGeneralSettingsForm } from "./service-group-general-settings-form";

export const ServiceGroupSettings = () => {
  const { pathname: path } = useLocation();
  const { params: { groupId = "", tab = "" } = {} } = matchPath<{ groupId: string; tab: string }>(path, {
    path: "/agents/group/:groupId/:tab",
  }) || {};
  const serviceGroup = useAdminConnection<ServiceGroupEntity>(`/api/groups/${groupId}`) || {};

  return (
    <div tw="flex flex-col w-full">
      <PageHeader
        title={(
          <div tw="flex items-center gap-x-4 w-full pt-5 pb-7">
            <Icons.Settings tw="text-monochrome-default" height={20} width={20} />
            Service Group Settings
          </div>
        )}
      />
      <div tw="px-6">
        <Link to={getPagePath({ name: "serviceGroupGeneralSettings", params: { groupId } })}>
          <Tab active={tab === "general-settings"}>General</Tab>
        </Link>
        <Link to={getPagePath({ name: "serviceGroupSystemSettings", params: { groupId } })}>
          <Tab active={tab === "system-settings"}>System</Tab>
        </Link>
        <Link to={getPagePath({ name: "serviceGroupPluginsSettings", params: { groupId } })}>
          <Tab active={tab === "plugins-settings"}>Plugins</Tab>
        </Link>
      </div>
      <Switch>
        <Route
          path={routes.serviceGroupSystemSettings}
          render={() => <SystemSettingsForm agent={serviceGroup} />}
        />
        <Route
          path={routes.serviceGroupPluginsSettings}
          render={() => <PluginsSettingsTab agent={serviceGroup} />}
        />
        <Route
          path={routes.serviceGroupGeneralSettings}
          render={() => <ServiceGroupGeneralSettingsForm serviceGroup={serviceGroup} />}
        />
      </Switch>
    </div>
  );
};
