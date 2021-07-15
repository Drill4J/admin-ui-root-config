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
import React, { useEffect } from "react";
import axios from "axios";
import { matchPath, useLocation } from "react-router-dom";
import {
  Formik, Field, Form, FormikProps,
} from "formik";
import { useFormHandleSubmit } from "@drill4j/common-hooks";
import { isPristine } from "@drill4j/common-utils";
import { sendNotificationEvent } from "@drill4j/send-notification-event";

import {
  Button, FormGroup, GeneralAlerts, Spinner,
} from "@drill4j/ui-kit";
import "twin.macro";

import {
  composeValidators, Fields, required, sizeLimit,
} from "forms";
import { Agent } from "types/agent";
import { routes } from "common";

interface Props {
  agent: Agent;
  setPristineSettings: (pristine: boolean) => void;
}

export const GeneralSettingsForm = ({ agent, setPristineSettings }: Props) => {
  const { pathname } = useLocation();
  const { params: { agentId = "" } = {} } = matchPath<{ agentId: string; }>(pathname, {
    path: routes.agentGeneralSettings,
  }) || {};
  return (
    <Formik
      onSubmit={async ({ name, description, environment }: Agent) => {
        try {
          await axios.patch(`/agents/${agentId}/info`, { name, description, environment });
          sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
        } catch ({ response: { data: { message } = {} } = {} }) {
          sendNotificationEvent({
            type: "ERROR",
            text: "On-submit error. Server problem or operation could not be processed in real-time",
          });
        }
      }}
      enableReinitialize
      initialValues={agent}
      validate={composeValidators(
        required("name"),
        sizeLimit({ name: "name" }),
        sizeLimit({ name: "environment" }),
        sizeLimit({ name: "description", min: 3, max: 256 }),
      ) as any}
    >
      {({
        isSubmitting, isValid, dirty,
      }) => (
        <Form tw="space-y-10">
          <GeneralAlerts type="INFO">
            Basic agent settings.
          </GeneralAlerts>
          <div tw="flex flex-col items-center gap-y-6">
            <FormGroup tw="w-97" label="Agent ID">
              <Field id="id" name="id" component={Fields.Input} disabled />
            </FormGroup>
            <FormGroup tw="w-97" label="Agent version">
              <Field name="agentVersion" component={Fields.Input} placeholder="n/a" disabled />
            </FormGroup>
            <FormGroup tw="w-97" label="Service Group">
              <Field name="group" component={Fields.Input} placeholder="n/a" disabled />
            </FormGroup>
            <FormGroup tw="w-97" label="Agent name">
              <Field name="name" component={Fields.Input} placeholder="Enter agent's name" />
            </FormGroup>
            <FormGroup tw="w-97" label="Description" optional>
              <Field
                tw="h-20"
                name="description"
                component={Fields.Textarea}
                placeholder="Add agent's description"
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
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                data-test="general-settings-form:save-changes-button"
              >
                {isSubmitting ? <Spinner disabled /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
