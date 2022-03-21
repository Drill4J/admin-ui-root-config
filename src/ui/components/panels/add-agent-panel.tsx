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
import { Button, Icons, LinkButton } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { useAdminConnection } from "hooks";
import { AgentBuildInfo, AgentInfo, ServiceGroup } from "types";
import { AGENT_STATUS } from "common";
import { EVENT_NAMES, sendAgentEvent } from "analityc";
import ReactGA from "react-ga";
import { PanelProps } from "./panel-props";
import { PanelWithCloseIcon } from "./panel-with-close-icon";
import { useSetPanelContext } from "./panel-context";
import { PanelStub } from "../panel-stub";

export const AddAgentPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const agentsList = useAdminConnection<AgentInfo[]>("/api/agents") || [];
  const groupsList = useAdminConnection<ServiceGroup[]>("/api/groups") || [];
  const setPanel = useSetPanelContext();
  const notRegisteredAgents = agentsList.filter((agent) => !agent.group && agent.agentStatus === AGENT_STATUS.NOT_REGISTERED);
  const notRegisteredGroupsAgents = agentsList.filter((agent) => agent.group && agent.agentStatus === AGENT_STATUS.NOT_REGISTERED);
  const groups = groupsList.map((group) => ({
    group,
    agents: notRegisteredGroupsAgents.filter((agent) => group.name === agent.group),
  }));

  return (
    <PanelWithCloseIcon
      tw="w-[1024px]"
      header={(
        <div tw="flex justify-between items-center h-20">
          Add Agent
          <LinkButton
            tw="text-14 leading-24"
            onClick={() => setPanel({
              type: "AGENT_PREREGISTRATION",
              payload: agentsList.map(({ id }) => id) as string[],
            })}
            data-test="add-agent-panel:open-preregister-agent-panel"
          >
            <Icons.Register /> Preregister Java Agent
          </LinkButton>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      {notRegisteredAgents.length || notRegisteredGroupsAgents.length ? (
        <>
          <Layout tw="text-monochrome-dark font-bold text-14 leading-24">
            <Column tw="col-start-2">Name</Column>
            <Column tw="col-start-3">Type</Column>
          </Layout>
          <div tw="flex flex-col gap-y-[6px] overflow-y-auto text-monochrome-dark-tint">
            {groups.map(({ group, agents: groupAgents }) => groupAgents.length > 0
            && <GroupRow key={group?.id} group={group} agents={groupAgents} />)}
            {notRegisteredAgents.map((agent) => (
              <Layout key={agent.id} bordered data-test="add-agent-panel:agent-row">
                <AgentRow agent={agent} />
              </Layout>
            ))}
          </div>
        </>
      ) : (
        <PanelStub
          icon={<Icons.Register width={80} height={70} />}
          title="There are no agents to register"
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
            </span>
          )}
        />
      )}
    </PanelWithCloseIcon>
  );
};

interface GroupRowProps {
  agents: AgentInfo[];
  group: ServiceGroup;
}

const GroupRow = ({ group, agents }:GroupRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setPanel = useSetPanelContext();
  return (
    <div tw="rounded-lg border border-monochrome-dark text-monochrome-dark-tint text-14 leading-20">
      <Layout
        css={[tw`border-monochrome-dark`, isOpen && tw`border-b`]}
        data-test="add-agent-panel:group-row"
      >
        <div
          tw="flex items-center justify-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icons.Expander
            rotate={isOpen ? 90 : 0}
            width={9}
            height={16}
          />
        </div>
        <Column title={group.name}>{group.name}</Column>
        <Column title="Multiservice">Multiservice</Column>
        <Button
          primary
          size="small"
          onClick={() => {
            setPanel({ type: "GROUP_REGISTRATION", payload: group });
            ReactGA.set({ dimension2: group.id });
            sendAgentEvent({
              name: EVENT_NAMES.CLICK_TO_REGISTER_BUTTON,
              label: agents.map(agent => agent.agentType).join("#"),
            });
          }}
          data-test="add-agent-panel:group-row:register"
        >
          <Icons.Register width={16} height={16} /> Register
        </Button>
      </Layout>
      {isOpen && agents.map((agent) => (
        <Layout key={agent.id} data-test="add-agent-panel:agent-row">
          <AgentRow agent={agent} />
        </Layout>
      ))}
    </div>
  );
};

const AgentRow = ({ agent }: { agent: AgentInfo}) => {
  const setPanel = useSetPanelContext();
  const {
    name, agentType, group, id,
  } = agent;
  const [buildInfo] = useAdminConnection<[AgentBuildInfo]>(`/api/agent/${id}/builds`) || [];

  return (
    <>
      <Column tw="col-start-2" title={name}>{name}</Column>
      <Column title={agentType}>{agentType}</Column>
      <Button
        onClick={() => {
          setPanel({
            type: agentType === "Java" ? "JAVA_AGENT_REGISTRATION" : "JS_AGENT_REGISTRATION",
            payload: {
              ...agent,
              systemSettings: buildInfo?.systemSettings,
            },
          });
          ReactGA.set({ dimension2: id });
          sendAgentEvent({
            name: EVENT_NAMES.CLICK_TO_REGISTER_BUTTON,
            label: agentType,
          });
        }}
        primary={!group}
        secondary={Boolean(group)}
        size="small"
        data-test="add-agent-panel:agent-row:register"
      >
        <Icons.Register width={16} height={16} /> Register
      </Button>
    </>
  );
};

const Layout = styled.div`
  ${tw`grid items-center grid-cols-[28px 3fr 1fr 104px] h-[60px] px-4`}
  ${({ bordered }: { bordered?: boolean }) => bordered
    && tw`rounded-lg box-border border border-monochrome-dark text-monochrome-dark-tint text-14 leading-20
  `}
`;

const Column = styled.div`
  ${tw`px-3 text-ellipsis`}
`;
