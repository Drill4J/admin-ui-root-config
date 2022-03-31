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
import React, { Dispatch, SetStateAction } from "react";
import { BrowserRouter } from "react-router-dom";
import { css } from "twin.macro";
import { Icons, Stub } from "@drill4j/ui-kit";

import { useAdminConnection, usePluginUrls } from "hooks";
import { AgentInfo, Plugin, ServiceGroup } from "types";
import { HUD, PanelType } from "components";
import { getPagePath } from "common";

interface Props {
  data?: AgentInfo | ServiceGroup;
  isGroup?: boolean;
  setPanel: Dispatch<SetStateAction<PanelType | null>>;
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <div tw="flex flex-col pt-5 px-6 h-full">
      <div tw="mb-6 text-24 leading-32 text-monochrome-black">Dashboard</div>
      {children}
    </div>
  </BrowserRouter>
);

export const Dashboard = ({ data, isGroup, setPanel }: Props) => {
  const { id = "" } = data || {};
  const plugins = useAdminConnection<Plugin[]>(isGroup ? `/groups/${id}/plugins` : `/agents/${id}/plugins`) || [];
  const installedPlugins = plugins.filter((plugin) => !plugin.available);
  const paths = usePluginUrls();

  if (!paths) {
    return <Wrapper><div tw="w-full h-full "><Loader /></div></Wrapper>;
  }

  if (!installedPlugins.length) {
    return (
      <Wrapper tw="flex-grow">
        <Stub
          icon={<Icons.Plugins width={160} height={160} />}
          title="No data available"
          message={(
            <div>
              There are no enabled plugins on this {isGroup ? "service Group" : "agent"} to collect the data from.
              <br /> To install a plugin go to
              <div
                onClick={() => setPanel({ type: "SETTINGS", payload: data })}
                tw="link block mt-1 font-bold"
              >
                {isGroup ? "Service Group" : "Agent"} settings page
              </div>
            </div>
          )}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      { installedPlugins.map(({ id: pluginId = "" }) => {
        const hudPath = paths[pluginId];
        return (
          <HUD
            key={pluginId}
            url={hudPath}
            name={isGroup ? "GroupHUD" : "AgentHUD"}
            customProps={{
              pluginPagePath: isGroup
                ? getPagePath({ name: "serviceGroupPlugin", params: { groupId: id, pluginId } })
                : getPagePath({ name: "agentPlugin", params: { agentId: id, pluginId } }),
            }}
          />
        );
      })}
    </Wrapper>
  );
};

const loaderStyles = css`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 10px solid rgba(255, 255, 255, 0.1);
  border-top-color: #09d;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Loader = () => (
  <div tw="w-full h-full flex justify-center items-center"><div css={loaderStyles} /></div>
);
