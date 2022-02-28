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
  DarkFormGroup, DisabledFormGroup, Field, Fields,
} from "@drill4j/ui-kit";

import "twin.macro";

interface Props {
  type: string;
}

export const GeneralSettingsForm = ({ type }: Props) => {
  const data: any = {};
  switch (type) {
    case "Group":
      data.idLabel = "Service Group ID";
      data.nameLabel = "Service Group Name";
      data.namePlaceholder = "Enter Service Group's name";
      data.descriptionPlaceholder = "Add some details about the Service Group";
      break;
    default:
      data.idLabel = "Agent ID";
      data.nameLabel = "Agent Name";
      data.namePlaceholder = "Enter Agent's name";
      data.descriptionPlaceholder = "Add some details about the Agent";
  }

  return (
    <>
      <div tw="w-[400px]">
        <DisabledFormGroup fields={[{ name: "id", label: data.idLabel }, { name: "agentType", label: "Type" }]} />
      </div>
      <DarkFormGroup label={data.nameLabel}>
        <Field name="name" component={Fields.DarkInput} placeholder={data.namePlaceholder} />
      </DarkFormGroup>
      <DarkFormGroup label="Description" optional>
        <Field
          name="description"
          component={Fields.DarkTextarea}
          placeholder={data.descriptionPlaceholder}
        />
      </DarkFormGroup>
    </>
  );
};
