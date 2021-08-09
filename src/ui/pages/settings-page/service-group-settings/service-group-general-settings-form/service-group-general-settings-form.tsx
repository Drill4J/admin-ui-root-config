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
import { matchPath, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Formik, Field, Form,

  Button, FormGroup, GeneralAlerts, Spinner, composeValidators, Fields, required, sizeLimit,
} from "@drill4j/ui-kit";
import { sendNotificationEvent } from "@drill4j/send-notification-event";

import "twin.macro";

import { ServiceGroupEntity } from "types/service-group-entity";

import { routes } from "common";
import { UnSaveChangeModal } from "pages/settings-page/un-save-changes-modal";
import { formatPackages } from "@drill4j/common-utils";

interface Props {
  serviceGroup: ServiceGroupEntity;
}

export const ServiceGroupGeneralSettingsForm = ({ serviceGroup }: Props) => {
  const { pathname } = useLocation();
  const { params: { groupId = "" } = {} } = matchPath<{ groupId: string }>(pathname, {
    path: routes.serviceGroupGeneralSettings,
  }) || {};

  return (
    <Formik
      onSubmit={async ({ name, description, environment }: ServiceGroupEntity) => {
        try {
          await axios.put(`/groups/${groupId}`, { name, description, environment });
          sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
        } catch ({ response: { data: { message } = {} } = {} }) {
          sendNotificationEvent({
            type: "ERROR",
            text: "On-submit error. Server problem or operation could not be processed in real-time",
          });
        }
      }}
      initialValues={{
        ...serviceGroup,
        systemSettings: {
          ...serviceGroup.systemSettings,
          packages: formatPackages(serviceGroup.systemSettings?.packages),
        },
      }}
      enableReinitialize
      validate={composeValidators(
        required("name", "Service Group Name"),
        sizeLimit({ name: "name", alias: "Service Group Name" }),
        sizeLimit({ name: "environment" }),
        sizeLimit({ name: "description", min: 3, max: 256 }),
      ) as any}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form tw="space-y-10">
          <GeneralAlerts type="INFO">
            Basic service group settings.
          </GeneralAlerts>
          <div tw="flex flex-col items-center">
            <div tw="w-97 space-y-6">
              <FormGroup label="Service Group ID">
                <Field name="id" component={Fields.Input} />
              </FormGroup>
              <FormGroup label="Service Group Name">
                <Field
                  name="name"
                  component={Fields.Input}
                  placeholder="Enter service group's name"
                />
              </FormGroup>
              <FormGroup label="Description" optional>
                <Field
                  name="description"
                  component={Fields.Textarea}
                  normalize={(str: string) => str.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
                  placeholder="Add service group's description"
                />
              </FormGroup>
              <FormGroup label="Environment" optional>
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
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  data-test="js-system-settings-form:save-changes-button"
                >
                  {isSubmitting ? <Spinner disabled /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
          <UnSaveChangeModal />
        </Form>
      )}
    </Formik>
  );
};
