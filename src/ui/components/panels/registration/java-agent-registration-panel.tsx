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
  composeValidators, formatPackages, parsePackages, required, requiredArray, sizeLimit,
} from "@drill4j/ui-kit";
import "twin.macro";

import { Agent } from "types";
import { unusedAgentName } from "utils";
import { useAdminConnection } from "hooks";
import { PanelProps } from "../panel-props";
import { Stepper } from "./stepper";
import { InstallPluginsStep, JavaGeneralRegistrationStep, SystemSettingsRegistrationStep } from "./steps";

export const JavaAgentRegistrationPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => {
  const agents = useAdminConnection<Agent[]>("/api/agents") || [];
  return (
    <Stepper
      label="Agent Registration"
      initialValues={{
        ...payload,
        ...payload.systemSettings,
        packages: formatPackages(payload.systemSettings?.packages),
      }}
      onSubmit={registerAgent}
      successMessage="Agent has been registered"
      steps={[
        {
          stepLabel: "General Info",
          validationSchema: composeValidators(
            unusedAgentName("name", agents),
            required("id", "Agent ID"),
            required("name", "Agent Name"),
            sizeLimit({
              name: "name", alias: "Name size should be between 3 and 64 characters", min: 3, max: 64,
            }),
            sizeLimit({ name: "description", min: 3, max: 256 }),
          ),
          component: <JavaGeneralRegistrationStep />,
        },
        {
          stepLabel: "System Settings",
          validationSchema: composeValidators(sizeLimit({
            name: "sessionIdHeaderName",
            alias: "Session header name",
            min: 1,
            max: 256,
          }),
          requiredArray("packages", "Path prefix is required.")),
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

async function registerAgent({
  id,
  name,
  environment,
  description,
  plugins,
  packages,
  sessionIdHeaderName,
  systemSettings,
}: any) {
  await axios.post(`/agents/${id}`, {
    name,
    environment,
    description,
    plugins,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(packages as unknown as string).filter(Boolean),
      sessionIdHeaderName,
    },
  });
}
