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
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icons, Spinner, Button } from "@drill4j/ui-kit";
import "twin.macro";

import { convertAgentName } from "utils";
import { AgentStatusBadge, NoAgentsSvg, PanelStub } from "components";
import { useAdminConnection, useRouteParams } from "hooks";
import {
  AgentInfo, BuildStatus, ServiceGroup, ActiveAgentsBuild, AgentBuildInfo,
} from "types";
import { AGENT_STATUS, getPagePath } from "common";
import { Panel } from "../panel";
import { PanelProps } from "../panel-props";
import {
  Column, CubeWrapper, GroupRow as StyledGroupRow, Layout, NameColumn, Row, AgentRow as StyledAgentRow, GroupAgentRow,
} from "./elements";
import { useSetPanelContext } from "../panel-context";

export const SelectAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const agentsList = useAdminConnection<AgentInfo[]>("/api/agents") || [];
  const groupsList = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const registeredAgentsBuilds = useAdminConnection<ActiveAgentsBuild[]>("/api/agents/build") || [];
  const setPanel = useSetPanelContext();

  const agents = useMemo(() => agentsList
    .filter((agent) => !agent.group && agent.agentStatus !== AGENT_STATUS.NOT_REGISTERED), [agentsList]);
  const groupsAgents = useMemo(() => agentsList
    .filter((agent) => agent.group && agent.agentStatus !== AGENT_STATUS.NOT_REGISTERED), [agentsList]);
  const registeredAgentsBuildsStatuses: Record<string, BuildStatus> = useMemo(() => registeredAgentsBuilds
    .reduce((acc, { agentId, build }) => ({ ...acc, [agentId]: build.buildStatus }), {}), [registeredAgentsBuilds]);
  const groups = useMemo(() => groupsList.map((group) => ({
    group,
    agents: groupsAgents.filter((agent) => group.id === agent.group),
  })), [groupsList, groupsAgents]);

  return (
    <Panel
      tw="w-[1024px]"
      header={(
        <div tw="flex justify-between items-center h-21">
          Select Agent
          <Button
            onClick={() => setPanel({ type: "ADD_AGENT" })}
            secondary
            size="large"
            data-test="select-agent-panel:open-add-agent-panel"
          >
            <Icons.Plus /> Add Agent
          </Button>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      {agents.length || groupsAgents.length ? (
        <div tw="text-monochrome-medium-tint text-14 leading-20">
          <Layout tw="text-monochrome-dark font-bold leading-24">
            <Column tw="col-start-3">Name</Column>
            <Column tw="col-start-4">Description</Column>
            <Column tw="col-start-5">Type</Column>
          </Layout>
          <div tw="flex flex-col gap-y-[6px] overflow-y-auto">
            {groups.map(({ group, agents: groupAgents }) => groupAgents.length > 0
            && <GroupRow key={group?.id} group={group} agents={groupAgents} agentBuildStatuses={registeredAgentsBuildsStatuses} />)}
            {agents.map((agent) => <AgentRow key={agent.id} agent={agent} buildStatus={registeredAgentsBuildsStatuses[agent.id]} />)}
          </div>
        </div>
      ) : (
        <PanelStub
          icon={<NoAgentsSvg className="text-monochrome-dark-tint text-opacity-40" />}
          title="No registered agents at the moment"
          message={(
            <span>
              Run your application with Drill4J Agent using&nbsp;
              <a
                tw="inline-flex items-center gap-x-1 text-blue-default font-semibold"
                href="https://drill4j.github.io/how-to-start/"
                rel="noopener noreferrer"
                target="_blank"
              >
                this guide <Icons.OpenInNewTab tw="inline" />
              </a>
              &nbsp;and add it.
            </span>
          )}
        />
      )}
    </Panel>
  );
};

interface AgentRowProps {
  agent: AgentInfo;
  buildStatus?: BuildStatus;
}

const AgentRow = ({ agent, buildStatus }: AgentRowProps) => {
  const {
    name = "", description = "", agentType = "", agentStatus, id = "", group,
  } = agent;
  const { agentId } = useRouteParams();
  const { push } = useHistory();
  const setPanel = useSetPanelContext();
  const [buildInfo] = useAdminConnection<[AgentBuildInfo]>(`/api/agent/${id}/builds`) || [];
  const isSelectedAgent = agentId === id;

  if (agentStatus === AGENT_STATUS.REGISTERING) return <RegisteringAgentRow {...agent} />;

  if (agentStatus === AGENT_STATUS.PREREGISTERED) return <PreregisteredAgentRow {...agent} />;

  const Wrapper = group ? GroupAgentRow : StyledAgentRow;

  return (
    <Wrapper
      selected={isSelectedAgent}
      onClick={() => {
        if (!String(window.getSelection())) { // no open dashboard if we have smth in clipboard
          push(getPagePath({
            name: "agentDashboard",
            params: { agentId: id },
          }));
        }
      }}
      data-test="select-agent-panel:agent-row"
    >
      <div /> {/* Hack for save layout */}
      <CubeWrapper isActive={isSelectedAgent}>{convertAgentName(name)}</CubeWrapper>
      <NameColumn title={name}>
        <AgentStatusBadge status={buildStatus} />
        <span tw="truncate">{name}</span>
      </NameColumn>
      <Column title={description}>{description}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Icons.Settings
        width={16}
        height={16}
        onClick={((event: any) => {
          event?.stopPropagation();
          setPanel({
            type: "SETTINGS",
            payload: {
              ...agent,
              systemSettings: buildInfo?.systemSettings,
            },
          });
        }) as any}
        tw="action-icon w-6 h-6 flex items-center justify-center"
      />
    </Wrapper>
  );
};

interface GroupRowProps {
  agents: AgentInfo[];
  group: ServiceGroup;
  agentBuildStatuses: Record<string, BuildStatus>
}

const GroupRow = ({ agents = [], group, agentBuildStatuses }: GroupRowProps) => {
  const { groupId, agentId: selectedAgentId } = useRouteParams();
  const [isOpen, setIsOpen] = useState(agents.some(agent =>
    agent.id === selectedAgentId || agent.agentStatus === AGENT_STATUS.REGISTERING));
  const { push } = useHistory();
  const setPanel = useSetPanelContext();
  const { id = "", name: groupName = "", description } = group;
  const isSelectedGroup = groupId === id;
  const hasRegisteredAgent = agents.some(agent => agent.agentStatus === AGENT_STATUS.REGISTERED);

  return (
    <div tw="rounded-lg bg-monochrome-black100">
      <StyledGroupRow
        data-test="select-agent-panel:group-row"
        selected={isSelectedGroup}
        isOpen={isOpen}
        onClick={() => {
          // window.getSelection() - clipboard. This check is need that we can copy group name without redirect to dashboard
          if (hasRegisteredAgent && !String(window.getSelection())) {
            push(getPagePath({
              name: "serviceGroupDashboard",
              params: { groupId: id },
            }));
          }
        }}
      >
        <Icons.Expander
          tw="action-icon flex items-center justify-center w-6 h-6"
          onClick={((event: any) => {
            event?.stopPropagation();
            setIsOpen(!isOpen);
          }) as any}
          rotate={isOpen ? 90 : 0}
          width={9}
          height={16}
        />
        <CubeWrapper isActive={isSelectedGroup} title={groupName}>{convertAgentName(groupName)}</CubeWrapper>
        <Column tw="text-monochrome-medium-tint" title={groupName}>{groupName}</Column>
        <Column title={description}>{description}</Column>
        <Column title="Multiservice">Multiservice</Column>
        <Icons.Settings
          width={16}
          height={16}
          tw="action-icon w-6 h-6 flex items-center justify-center"
          onClick={((event: any) => {
            event?.stopPropagation();
            setPanel({ type: "SETTINGS", payload: { ...group, agentType: "Group" } });
          }) as any}
        />
      </StyledGroupRow>
      {isOpen && agents.map((agent: AgentInfo) => <AgentRow key={agent.id} agent={agent} buildStatus={agentBuildStatuses[agent.id]} />)}
    </div>
  );
};

const PreregisteredAgentRow = (agent: AgentInfo) => {
  const setPanel = useSetPanelContext();
  const {
    name = "", description, agentType, id,
  } = agent;
  const [buildInfo] = useAdminConnection<[AgentBuildInfo]>(`/api/agent/${id}/builds`) || [];

  return (
    <Row tw="bg-transparent text-monochrome-dark-tint">
      <CubeWrapper tw="col-start-2">{convertAgentName(name)}</CubeWrapper>
      <NameColumn tw="text-monochrome-dark-tint" title={name}>{name}</NameColumn>
      <Column title={description}>{description}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Icons.Settings
        width={16}
        height={16}
        onClick={((event: any) => {
          event?.stopPropagation();
          setPanel({
            type: "SETTINGS",
            payload: {
              ...agent,
              systemSettings: buildInfo?.systemSettings,
            },
          });
        }) as any}
        tw="action-icon w-6 h-6 flex items-center justify-center"
      />
    </Row>
  );
};

const RegisteringAgentRow = ({
  name = "", description, agentType,
}: AgentInfo) => (
  <Row
    tw="text-opacity-40"
    data-test="select-agent-panel:registering-agent-row"
  >
    <div /> {/* Hack for save layout */}
    <div tw="flex justify-center items-center"><Spinner color="blue" /></div>
    <NameColumn title={name}>
      <span>Registering: {name}</span>
    </NameColumn>
    <Column title={description}>{description}</Column>
    <Column title={agentType}>{agentType}</Column>
  </Row>
);
