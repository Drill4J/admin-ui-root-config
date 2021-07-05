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
import { useParams } from "react-router-dom";
import "twin.macro";

import { useAdminConnection } from "hooks";
import { Agent } from "types/agent";
import { HUD } from "components";
import { paths } from "../../../containers-paths";

export const Dashboard = () => {
  const { agentId = "" } = useParams<{ agentId?: string; buildVersion?: string }>();
  const { plugins = [] } =
    useAdminConnection<Agent>(`/api/agents/${agentId}`) || {};
  const installedPlugins = plugins.filter((plugin) => !plugin.available);

  return (
    <div tw="w-full mt-5 px-6">
      <div tw="mb-7 text-24 leading-32 font-light">Dashboard</div>
      {installedPlugins.map(({ id = "" }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const hudPath = paths[id];
        return <HUD key={id} url={hudPath} />;
      })}
    </div>
  );
};
