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
import {
  Field, DarkFormGroup, GeneralAlerts, Fields,
} from "@drill4j/ui-kit";

import { styled } from "twin.macro";

const HEADERS_HEIGHT = 275;

const Content = styled.div`height: calc(100vh - ${HEADERS_HEIGHT}px);`;

export const ServiceGroupGeneralRegistrationForm = () => (
  <>
    <GeneralAlerts type="INFO">
      Set up basic Service Group settings.
    </GeneralAlerts>
    <Content tw="flex flex-col items-center pt-10 overflow-auto">
      <div tw="w-97 space-y-6">
        <DarkFormGroup label="Service Group ID">
          <Field name="id" component={Fields.Input} placeholder="Enter agent's ID" disabled />
        </DarkFormGroup>
        <DarkFormGroup label="Service Group Name">
          <Field name="name" component={Fields.Input} placeholder="Enter service group's name" />
        </DarkFormGroup>
        <DarkFormGroup label="Description" optional>
          <Field
            name="description"
            component={Fields.Textarea}
            normalize={(str: string) => str.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
            placeholder="Add service group's description"
          />
        </DarkFormGroup>
        <DarkFormGroup label="Environment" optional>
          <Field
            name="environment"
            component={Fields.Input}
            placeholder="Specify an environment"
          />
        </DarkFormGroup>
      </div>
    </Content>
  </>
);
