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
import { FormValidator, getPropertyByPath } from "@drill4j/ui-kit";
import { Agent } from "../types";

export function unusedAgentName(field: string, agents: { single: Agent[], grouped: Agent[] }): FormValidator {
  return (valitationItem) => {
    const value = getPropertyByPath<string>(valitationItem, field);
    const registredAgents = agents.single.filter(agent => agent.agentStatus !== "NOT_REGISTERED");
    const isSomeAgent = registredAgents.some(agent => agent.name === value);
    return isSomeAgent ? { [field]: "Agent with such name already exists. Please choose a different name." } : {};
  };
}
