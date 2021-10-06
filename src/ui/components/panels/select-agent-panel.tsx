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
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Badge, Icons, Spinner } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { convertAgentName } from "utils";
import { useAdminConnection, useAgentRouteParams } from "hooks";
import {
  Agent, ServiceGroup,
} from "types";
import { AGENT_STATUS, getPagePath } from "common";
import { Panel } from "./panel";
import { PanelProps } from "./panel-props";
import { Cube } from "../cubes";
import { AgentStatusBadge } from "../agent-status-badge";

export const SelectAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const agentsList = useAdminConnection<Agent[]>("/api/agents") || [];
  const groupsList = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const agents = agentsList.filter((agent) => !agent.group && agent.status !== AGENT_STATUS.NOT_REGISTERED);
  const groupsAgents = agentsList.filter((agent) => agent.group && agent.status !== AGENT_STATUS.NOT_REGISTERED);
  const groups = groupsList.map((group) => ({
    group,
    agents: groupsAgents.filter((agent) => group.name === agent.group),
  }));
  return (
    <Panel header={<div tw="flex items-center h-21">Select Agent</div>} isOpen={isOpen} onClosePanel={onClosePanel}>
      <div tw="w-[1024px] text-monochrome-medium-tint text-14 leading-20">
        <Layout tw="text-monochrome-dark font-bold leading-24">
          <ColumnWithMargin tw="col-start-3">Name</ColumnWithMargin>
          <ColumnWithMargin tw="col-start-4">Description</ColumnWithMargin>
          <ColumnWithMargin tw="col-start-5">Type</ColumnWithMargin>
        </Layout>
        <div tw="flex flex-col gap-y-[6px] overflow-y-auto">
          {groups.map(({ group, agents: groupAgents }) => groupAgents.length > 0
            && <GroupRow key={group?.id} group={group} agents={groupAgents} />)}
          {agents.map((agent) => <AgentRow key={agent.id} {...agent} />)}
        </div>
      </div>
    </Panel>
  );
};

const AgentRow = ({
  name = "", description = "", agentType = "", status, id = "", group, buildVersion = "", agentVersion,
}: Agent) => {
  const { agentId } = useAgentRouteParams();
  const { push } = useHistory();
  const isPreregisteredAgent = agentType === "Java" && !agentVersion;
  const isRegistering = status === AGENT_STATUS.REGISTERING;
  const isSelectedAgent = agentId === id;

  return (
    <Row
      selected={isSelectedAgent}
      isGroupAgent={Boolean(group)}
      isRegistering={isRegistering}
      isPreregisteredAgent={isPreregisteredAgent}
      onClick={() => {
        if (!String(window.getSelection())) {
          push(getPagePath({
            name: "agentDashboard",
            params: { agentId: id, buildVersion },
          }));
        }
      }}
    >
      <Badge color="green" bold tw="opacity-0">NEW</Badge>
      {isRegistering
        ? <div tw="flex justify-center items-center"><Spinner /></div>
        : <CubeWrapper tw="ml-2" isActive={isSelectedAgent}>{convertAgentName(name)}</CubeWrapper>}
      <ColumnWithMargin tw="flex gap-x-1 items-center text-monochrome-medium-tint text-opacity-[inherit]" title={name}>
        <AgentStatusBadge status={status} />
        <span>
          {isRegistering && "Registering: "}
          {isPreregisteredAgent && "Preregistered "}
          {name}
        </span>
      </ColumnWithMargin>
      <ColumnWithMargin title={description}>{description}</ColumnWithMargin>
      <ColumnWithMargin title={agentType}>{agentType}</ColumnWithMargin>
      {!isRegistering && (
        <Icons.Settings
          width={16}
          height={16}
          onClick={((event: any) => {
            event?.stopPropagation();
          }) as any}
          tw="text-monochrome-white cursor-pointer"
        />
      )}
    </Row>
  );
};

interface GroupRowProps {
  agents: Agent[];
  group: ServiceGroup;
}

const GroupRow = ({ agents = [], group: { id = "", name: groupName = "", description } }: GroupRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { groupId } = useAgentRouteParams();
  const { push } = useHistory();
  const isSelectedGroup = groupId === id;

  return (
    <div tw="rounded-lg bg-monochrome-black100">
      <GroupExpanderLayout
        selected={isSelectedGroup}
        isOpen={isOpen}
        onClick={() => {
          if (!String(window.getSelection())) {
            push(getPagePath({
              name: "serviceGroupDashboard",
              params: { groupId: id },
            }));
          }
        }}
      >
        <div
          tw="flex items-center justify-center cursor-pointer"
          onClick={((event: any) => {
            event?.stopPropagation();
            setIsOpen(!isOpen);
          }) as any}
        >
          <Icons.Expander
            rotate={isOpen ? 90 : 0}
            width={9}
            height={16}
          />
        </div>
        <CubeWrapper tw="ml-2" isActive={isSelectedGroup} title={groupName}>{convertAgentName(groupName)}</CubeWrapper>
        <ColumnWithMargin tw="text-monochrome-medium-tint" title={groupName}>{groupName}</ColumnWithMargin>
        <ColumnWithMargin title={description}>{description}</ColumnWithMargin>
        <ColumnWithMargin title="Multiservice">Multiservice</ColumnWithMargin>
        <Icons.Settings
          width={16}
          height={16}
          tw="text-monochrome-white cursor-pointer"
          onClick={((event: any) => {
            event?.stopPropagation();
          }) as any}
        />
      </GroupExpanderLayout>
      {isOpen && agents.map((agent) => <AgentRow key={agent.id} {...agent} />)}
    </div>
  );
};

const Layout = styled.div`
  ${tw`grid items-center grid-cols-[28px 44px 3fr 4fr 112px 16px] h-[60px] pl-4 pr-6`}
`;

const Row = styled(Layout)(({
  selected, isGroupAgent, isRegistering, isPreregisteredAgent,
}:{ selected?: boolean; isGroupAgent?: boolean; isRegistering?: boolean; isPreregisteredAgent?: boolean }) => [
  tw`rounded-lg bg-monochrome-dark100 box-border border border-monochrome-dark100 text-monochrome-dark-tint`,
  !isRegistering && !isPreregisteredAgent && tw`hover:(border border-blue-default border-opacity-50)`,
  isGroupAgent && tw`bg-monochrome-black100 border-monochrome-black100`,
  selected && tw`border-blue-default border-opacity-100 hover:(border-blue-default border-opacity-100)`,
  isRegistering && tw`text-opacity-40`,
  isPreregisteredAgent && tw`bg-monochrome-black text-opacity-40`,
]);

const GroupExpanderLayout = styled(Row)(({ isOpen }: {isOpen: boolean}) => [
  isOpen && tw`rounded-br-none rounded-bl-none`,
]);

const CubeWrapper = styled(Cube)`
  ${tw`text-monochrome-medium-tint cursor-default`}
  ${({ isActive }) => !isActive && tw`bg-monochrome-dark hover:bg-monochrome-dark`}
`;

const ColumnWithMargin = styled.div`
  ${tw`mx-3 text-ellipsis`}
`;
