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
import { composeValidators, required, sizeLimit } from "@drill4j/ui-kit";
import "twin.macro";

import { Agent } from "types";
import { InstallPluginsStep, JsGeneralRegistrationStep, JsSystemSettingsRegistrationStep } from "./steps";
import { PanelProps } from "../panel-props";
import { Stepper } from "./stepper";

export const JsAgentRegistrationPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => (
  <Stepper
    label="Agent Registration"
    initialValues={payload}
    onSubmit={registerAgent}
    steps={[
      {
        stepLabel: "General Info",
        validationSchema: composeValidators(
          required("name"),
          sizeLimit({ name: "name" }),
          sizeLimit({ name: "description", min: 3, max: 256 }),
        ),
        component: <JsGeneralRegistrationStep />,
      },
      {
        stepLabel: "System Settings",
        validationSchema: composeValidators(
          required("systemSettings.targetHost", "Target Host"),
        ),
        component: <JsSystemSettingsRegistrationStep />,
      },
      {
        stepLabel: "Plugins",
        validationSchema: composeValidators(
          required("name"),
          sizeLimit({ name: "name" }),
          sizeLimit({ name: "description", min: 3, max: 256 }),
        ),
        component: <InstallPluginsStep />,
      },
    ]}
    isOpen={isOpen}
    setIsOpen={onClosePanel}
  />
);

async function registerAgent({
  id,
  name,
  description,
  plugins,
  systemSettings,
}: Agent) {
  await axios.post(`/agents/${id}`, {
    name,
    description,
    plugins,
    systemSettings,
  });
}
