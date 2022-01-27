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
import axios from "axios";
import {
  Formik, Field, Form,
  Button, FormGroup, GeneralAlerts, Spinner, composeValidators, Fields, required, sizeLimit,
} from "@drill4j/ui-kit";
import { matchPath, useLocation } from "react-router-dom";
import { sendAlertEvent } from "@drill4j/send-alert-event";

import "twin.macro";

import { Agent } from "types/agent";
import { routes } from "common";
import { UnSaveChangeModal } from "pages/settings-page/un-save-changes-modal";

interface Props {
  agent: Agent;
}

export const GeneralSettingsForm = ({ agent }: Props) => {
  const { pathname } = useLocation();
  const { params: { agentId = "" } = {} } = matchPath<{ agentId: string; }>(pathname, {
    path: routes.agentGeneralSettings,
  }) || {};
  return (
    <Formik
      onSubmit={async ({ name, description, environment }: Agent) => {
        try {
          await axios.patch(`/agents/${agentId}/info`, { name, description, environment });
          sendAlertEvent({ type: "SUCCESS", title: "New settings have been saved" });
        } catch ({ response: { data: { message } = {} } = {} }) {
          sendAlertEvent({
            type: "ERROR",
            title: "On-submit error. Server problem or operation could not be processed in real-time",
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
          <div tw="flex flex-col items-center">
            <div tw="w-97 space-y-6">
              <FormGroup label="Agent ID">
                <Field id="id" name="id" component={Fields.Input} disabled />
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
              <div tw="mt-4">
                <Button
                  className="flex justify-center items-center gap-x-1 w-32"
                  primary
                  size="large"
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  data-test="general-settings-form:save-changes-button"
                >
                  {isSubmitting ? <Spinner /> : "Save Changes"}
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
