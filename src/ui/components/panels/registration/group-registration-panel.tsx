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
import { GroupGeneralRegistrationStep, GroupSystemSettingsRegistrationStep, InstallPluginsStep } from "./steps";
import { PanelProps } from "../panel-props";
import { Stepper } from "./stepper";

export const GroupRegistrationPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => (
  <Stepper
    label="Service Group Registration"
    initialValues={{
      ...payload,
      systemSettings: {
        ...payload.systemSettings,
        packages: formatPackages(payload.systemSettings?.packages),
      },
    }}
    onSubmit={registerGroup}
    steps={[
      {
        stepLabel: "General Info",
        validationSchema: composeValidators(
          required("name"),
          sizeLimit({ name: "name" }),
          sizeLimit({ name: "description", min: 3, max: 256 }),
        ),
        component: <GroupGeneralRegistrationStep />,
      },
      {
        stepLabel: "System Settings",
        validationSchema: composeValidators(sizeLimit({
          name: "systemSettings.sessionIdHeaderName",
          alias: "Session header name",
          min: 1,
          max: 256,
        }),
        requiredArray("systemSettings.packages", "Path prefix is required.")),
        component: <GroupSystemSettingsRegistrationStep />,
      },
      {
        stepLabel: "Plugins",
        validationSchema: composeValidators(
          required("name"),
          sizeLimit({ name: "name" }),
          sizeLimit({ name: "environment" }),
          sizeLimit({ name: "description", min: 3, max: 256 }),
        ),
        component: <InstallPluginsStep />,
      },
    ]}
    isOpen={isOpen}
    setIsOpen={onClosePanel}
  />
);

async function registerGroup({
  id,
  plugins,
  name = "",
  systemSettings,
  description,
}: Agent) {
  await axios.patch(`/groups/${id}`, {
    plugins,
    name,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(systemSettings?.packages as unknown as string).filter(Boolean),
    },
    description,
  });
}
