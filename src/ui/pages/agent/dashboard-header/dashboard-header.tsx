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
import { AgentInfo, BuildStatus, ServiceGroup } from "types";
import { Badge, Icons } from "@drill4j/ui-kit";
import "twin.macro";
import { BUILD_STATUS } from "common";
import { PanelType } from "../../../components";

interface Props {
  data?: AgentInfo | ServiceGroup;
  status?: BuildStatus;
  icon: React.ReactNode;
  setPanel: Dispatch<SetStateAction<PanelType | null>>;
}

export const DashboardHeader = ({
  data, status, icon, setPanel,
}: Props) => (
  <div tw="flex items-center gap-x-4 h-24 px-6 border-b border-monochrome-medium-tint">
    {icon}
    <span tw="max-w-1/2 text-ellipsis text-32 leading-40 text-monochrome-black" title={data?.name}>{data?.name}</span>
    {getBadge(status)}
    <Icons.Settings tw="link ml-auto" onClick={() => setPanel({ type: "SETTINGS", payload: { ...data } })} />
  </div>
);

const getBadge = (status?: BuildStatus) => {
  if (status === BUILD_STATUS.ONLINE) {
    return <Badge color="green">Online</Badge>;
  }
  if (status === BUILD_STATUS.OFFLINE) {
    return <Badge color="gray">Offline</Badge>;
  }
  if (status === BUILD_STATUS.BUSY) {
    return <Badge color="orange">Busy</Badge>;
  }
  return null;
};
