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
  DarkFormGroup, DisabledFormGroup, Field, Fields, useFormikContext,
} from "@drill4j/ui-kit";
import "twin.macro";

export const GroupGeneralRegistrationStep = () => {
  const { values: { disableFocus } } = useFormikContext();

  return (
    <div tw="space-y-8 w-[400px]">
      <DisabledFormGroup fields={[{ label: "Service Group ID", name: "id" }]} />
      <DarkFormGroup label="Service Group Name">
        <Field
          name="name"
          component={Fields.DarkInput}
          placeholder="Enter Service Group's name"
          focus={!disableFocus}
          select={!disableFocus}
        />
      </DarkFormGroup>
      <DarkFormGroup label="Description" optional>
        <Field
          name="description"
          component={Fields.DarkTextarea}
          placeholder="Add some details about the Service Group"
        />
      </DarkFormGroup>
    </div>
  );
};
