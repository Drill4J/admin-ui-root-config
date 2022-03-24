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

interface labelsAndPlaceholdersData {
  idLabel?: string,
  nameLabel?: string,
  namePlaceholder?: string,
  descriptionPlaceholder?: string,
}

export const GeneralSettingsForm = ({ type }: Props) => {
  let data: labelsAndPlaceholdersData = {};
  if (type === "Group") {
    data = {
      idLabel: "Service Group ID",
      nameLabel: "Service Group Name",
      namePlaceholder: "Enter Service Group's name",
      descriptionPlaceholder: "Add some details about the Service Group",
    };
  } else {
    data = {
      idLabel: "Agent ID",
      nameLabel: "Agent Name",
      namePlaceholder: "Enter Agent's name",
      descriptionPlaceholder: "Add some details about the Agent",
    };
  }

  return (
    <>
      <DisabledFormGroup fields={[{ name: "id", label: data.idLabel }, { name: "agentType", label: "Type" }]} />
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
