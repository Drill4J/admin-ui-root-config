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
import { DarkFormGroup, Field, Fields } from "@drill4j/ui-kit";
import "twin.macro";

export const AgentGeneralPreregistrationStep = () => (
  <div tw="space-y-6 w-[400px]">
    <DarkFormGroup label="Agent ID">
      <Field name="id" component={Fields.DarkInput} placeholder="Specify Agent's ID" />
    </DarkFormGroup>
    <DarkFormGroup label="Agent name">
      <Field name="name" component={Fields.DarkInput} placeholder="Enter agent's name" />
    </DarkFormGroup>
    <DarkFormGroup label="Description" optional>
      <Field
        name="description"
        component={Fields.DarkTextarea}
        placeholder="Add some details about the Agent"
      />
    </DarkFormGroup>
  </div>
);
