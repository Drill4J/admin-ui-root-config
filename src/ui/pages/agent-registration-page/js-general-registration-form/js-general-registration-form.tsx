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
  Field, FormGroup, GeneralAlerts, Fields,
} from "@drill4j/ui-kit";

import { styled } from "twin.macro";

const Content = styled.div`height: calc(100vh - 270px);`;

export const JsGeneralRegistrationForm = () => (
  <>
    <GeneralAlerts type="INFO">
      Set up basic agent settings.
    </GeneralAlerts>
    <Content tw="flex flex-col items-center pt-10 overflow-auto">
      <div tw="w-97 space-y-6">
        <FormGroup label="Agent ID">
          <Field name="id" component={Fields.Input} placeholder="Enter agent's ID" disabled />
        </FormGroup>
        <FormGroup label="Agent version">
          <Field name="agentVersion" component={Fields.Input} placeholder="n/a" disabled />
        </FormGroup>
        <FormGroup label="Service Group">
          <Field name="group" component={Fields.Input} placeholder="n/a" disabled />
        </FormGroup>
        <FormGroup label="Agent name">
          <Field name="name" component={Fields.Input} placeholder="Enter agent's name" />
        </FormGroup>
        <FormGroup label="Description" optional>
          <Field
            name="description"
            component={Fields.Textarea}
            normalize={(str: string) => str.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
            placeholder="Add agent's description"
          />
        </FormGroup>
        <FormGroup label="Environment" optional>
          <Field
            name="environment"
            component={Fields.Input}
            placeholder="Specify an environment"
          />
        </FormGroup>
      </div>
    </Content>
  </>
);
