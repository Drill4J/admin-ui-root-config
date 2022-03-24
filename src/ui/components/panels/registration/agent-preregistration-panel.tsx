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
import axios from "axios";
import {
  alreadyExist, composeValidators, idValidator, parsePackages, required, requiredArray, sizeLimit,
} from "@drill4j/ui-kit";
import "twin.macro";

import { useAdminConnection } from "hooks";
import { unusedAgentName } from "utils";
import { Agent } from "types";
import { AgentGeneralPreregistrationStep, InstallPluginsStep, SystemSettingsRegistrationStep } from "./steps";
import { Stepper } from "./stepper";
import { PanelProps } from "../panel-props";

export const AgentPreregistrationPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => {
  const agents = useAdminConnection<Agent[]>("/api/agents") || [];
  return (
    <Stepper
      label={(
        <div tw="space-y-2">
          <div>Java Agent Preregistration</div>
          <div tw="text-14 leading-24 text-monochrome-dark-tint">
            Preconfiguration for background instrumentation until the Agent syncs with the Drill4j Admin.
          </div>
        </div>
      )}
      onSubmit={preregisterOfflineAgent}
      successMessage="Agent has been preregistered"
      steps={[
        {
          stepLabel: "General Info",
          validationSchema: composeValidators(
            alreadyExist("id", payload as string[], "This name already exists"),
            idValidator("id", "Agent ID"),
            required("id", "Agent ID"),
            sizeLimit({
              name: "id", alias: "Agent ID", min: 1, max: 32,
            }),
            required("name"),
            unusedAgentName("name", agents),
            sizeLimit({
              name: "name", alias: "Name size should be between 3 and 64 characters", min: 3, max: 64,
            }),
            sizeLimit({ name: "environment" }),
            sizeLimit({ name: "description", min: 3, max: 256 }),
          ),
          component: <AgentGeneralPreregistrationStep />,
        },
        {
          stepLabel: "System Settings",
          validationSchema: composeValidators(sizeLimit({
            name: "sessionIdHeaderName",
            alias: "Session header name",
            min: 1,
            max: 256,

          }),
          requiredArray("packages", "Path prefix")),
          component: <SystemSettingsRegistrationStep />,
        },
        {
          stepLabel: "Plugins",
          validationSchema: composeValidators(
            requiredArray("plugins"),
          ),
          component: <InstallPluginsStep />,
        },
      ]}
      isOpen={isOpen}
      setIsOpen={onClosePanel}
    />
  );
};

async function preregisterOfflineAgent({
  id,
  name,
  description,
  plugins,
  systemSettings,
  agentType = "JAVA",
  packages,
  sessionIdHeaderName,
}: any) {
  await axios.post("/agents", {
    id,
    name,
    agentType,
    description,
    plugins,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(packages as unknown as string).filter(Boolean),
      sessionIdHeaderName,
    },
  });
  sessionStorage.removeItem("preregistered");
}
