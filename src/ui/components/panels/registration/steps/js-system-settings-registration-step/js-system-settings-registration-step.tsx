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
  DarkFormGroup, Field, Fields, Icons, Tooltip,
} from "@drill4j/ui-kit";

import "twin.macro";

export const JsSystemSettingsRegistrationStep = () => (
  <DarkFormGroup
    label={(
      <div tw="flex gap-x-2 items-center w-[400px]">
        Target Host
        <Tooltip message="Specify URL where your application is located">
          <Icons.Info />
        </Tooltip>
      </div>
    )}
  >
    <Field
      name="systemSettings.targetHost"
      component={Fields.DarkInput}
      placeholder="http(s)://example.com"
    />
  </DarkFormGroup>
);
