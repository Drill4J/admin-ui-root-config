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
import React, { useContext, useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import axios from "axios";
import { Form, Field } from "react-final-form";
import { useFormHandleSubmit } from "@drill4j/react-hooks";

import {
  Button, FormGroup, GeneralAlerts, Spinner,
} from "@drill4j/ui-kit";
import "twin.macro";

import {
  composeValidators, Fields, required, sizeLimit,
} from "forms";
import { ServiceGroupEntity } from "types/service-group-entity";
import { NotificationManagerContext } from "notification-manager";
import { isPristine } from "utils";

interface Props {
  serviceGroup: ServiceGroupEntity;
  setPristineSettings: (pristine: boolean) => void;
}

export const ServiceGroupGeneralSettingsForm = ({ serviceGroup, setPristineSettings }: Props) => {
  const { showMessage } = useContext(NotificationManagerContext);
  const { pathname } = useLocation();
  const { params: { id = "" } = {} } = matchPath<{ id: string }>(pathname, {
    path: "/:type/:id/settings",
  }) || {};

  return (
    <Form
      onSubmit={async ({ name, description, environment }: ServiceGroupEntity) => {
        try {
          await axios.put(`/groups/${id}`, { name, description, environment });
          showMessage({ type: "SUCCESS", text: "New settings have been saved" });
        } catch ({ response: { data: { message } = {} } = {} }) {
          showMessage({
            type: "ERROR",
            text: "On-submit error. Server problem or operation could not be processed in real-time",
          });
        }
      }}
      initialValues={serviceGroup}
      validate={composeValidators(
        required("name", "Service Group Name"),
        sizeLimit({ name: "name", alias: "Service Group Name" }),
        sizeLimit({ name: "environment" }),
        sizeLimit({ name: "description", min: 3, max: 256 }),
      ) as any}
      render={(props) => {
        const ref = useFormHandleSubmit(props);
        const {
          handleSubmit, submitting, invalid, values,
        } = props || {};
        const pristine = isPristine(serviceGroup, values);

        useEffect(() => {
          setPristineSettings(pristine);
        }, [pristine]);

        return (
          <form ref={ref} tw="space-y-10">
            <GeneralAlerts type="INFO">
              Basic service group settings.
            </GeneralAlerts>
            <div tw="flex flex-col items-center gap-y-6">
              <FormGroup tw="w-97" label="Service Group ID">
                <Field name="id" component={Fields.Input} disabled />
              </FormGroup>
              <FormGroup tw="w-97" label="Service Group Name">
                <Field
                  name="name"
                  component={Fields.Input}
                  placeholder="Enter service group's name"
                />
              </FormGroup>
              <FormGroup tw="w-97" label="Description" optional>
                <Field
                  tw="h-20"
                  name="description"
                  component={Fields.Textarea}
                  placeholder="Add service group's description"
                />
              </FormGroup>
              <FormGroup tw="w-97" label="Environment" optional>
                <Field
                  name="environment"
                  component={Fields.Input}
                  placeholder="Specify an environment"
                />
              </FormGroup>
              <div tw="w-97 mt-4">
                <Button
                  className="flex justify-center items-center gap-x-1 w-32"
                  primary
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitting || invalid || pristine}
                  data-test="js-system-settings-form:save-changes-button"
                >
                  {submitting ? <Spinner disabled /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
