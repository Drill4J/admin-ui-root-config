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
import React, { useState } from "react";
import axios from "axios";
import { matchPath, useLocation } from "react-router-dom";
import {
  Icons, Tooltip, GeneralAlerts, FormGroup, Spinner, Button,
} from "@drill4j/ui-kit";
import { Formik, Field, Form } from "formik";
import "twin.macro";

import {
  composeValidators, Fields, requiredArray, sizeLimit,
} from "forms";
import { UnlockingSystemSettingsFormModal } from "modules";
import {
  parsePackages, formatPackages, dotsAndSlashesToSlash,
} from "@drill4j/common-utils";
import { Agent } from "types/agent";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import { routes } from "common";
import { UnSaveChangeModal } from "pages/settings-page/un-save-changes-modal";

interface Props {
  agent: Agent;
}

export const SystemSettingsForm = ({ agent }: Props) => {
  const [unlockedPackages, setUnlockedPackages] = useState(false);
  const [isUnlockingModalOpened, setIsUnlockingModalOpened] = useState(false);
  const { pathname } = useLocation();
  const { params: { agentId = "", groupId = "" } = {} } = matchPath<{ agentId: string; groupId: string }>(pathname, {
    path: [routes.agentSystemSettings, routes.serviceGroupSystemSettings],
  }) || {};

  return (
    <Formik
      onSubmit={async ({ systemSettings: { sessionIdHeaderName, packages = [], targetHost } = {} }: Agent) => {
        try {
          const systemSettings = {
            packages: packages.filter(Boolean),
            sessionIdHeaderName,
            targetHost,
          };
          await axios.put(groupId ? `/groups/${groupId}/system-settings` : `/agents/${agentId}/system-settings`, systemSettings);
          sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
          setUnlockedPackages(false);
        } catch ({ response: { data: { message } = {} } = {} }) {
          sendNotificationEvent({
            type: "ERROR",
            text: "On-submit error. Server problem or operation could not be processed in real-time",
          });
        }
      }}
      initialValues={agent}
      validate={composeValidators(
        requiredArray("systemSettings.packages", "Path prefix is required."),
        sizeLimit({
          name: "systemSettings.sessionIdHeaderName",
          alias: "Session header name",
          min: 1,
          max: 256,
        }),
      ) as any}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form tw="space-y-10">
          <GeneralAlerts type="INFO">
            {groupId
              ? "System settings are related only to Java agents."
              : "Information related to your application / project."}
          </GeneralAlerts>
          <div tw="flex flex-col items-center">
            <div tw="w-97 space-y-6">
              <div>
                <div tw="flex items-center gap-x-2 mb-2">
                  <span tw="font-bold text-14 leading-20 text-monochrome-black">Project Package(s)</span>
                  <div
                    className={`flex items-center ${unlockedPackages ? "text-red-default" : "text-monochrome-default"}`}
                    onClick={() => {
                      unlockedPackages ? isValid && setUnlockedPackages(false) : setIsUnlockingModalOpened(true);
                    }}
                  >
                    {unlockedPackages ? (
                      <Icons.Unlocked />
                    ) : (
                      <Tooltip
                        message={(
                          <div tw="flex flex-col items-center w-full font-regular text-12 leading-16">
                            <span>Secured from editing.</span>
                            <span> Click to unlock.</span>
                          </div>
                        )}
                      >
                        <Icons.Locked />
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Field
                  component={Fields.Textarea}
                  name="systemSettings.packages"
                  parse={parsePackages}
                  format={formatPackages}
                  placeholder="e.g. com/example/mypackage&#10;foo/bar/baz&#10;and so on."
                  disabled={!unlockedPackages}
                  normalize={dotsAndSlashesToSlash}
                />
                {unlockedPackages && (
                  <div tw="w-97 text-12 leading-16 text-monochrome-default">
                    Make sure you add application packages only, otherwise agent&apos;s performance will be affected.
                    Use new line as a separator, &quot;!&quot; before package/class for excluding and
                    use &quot;/&quot; in a package path.
                  </div>
                )}
              </div>
              <FormGroup label="Header Mapping" optional>
                <Field
                  name="systemSettings.sessionIdHeaderName"
                  component={Fields.Input}
                  placeholder="Enter session header name"
                />
              </FormGroup>
              <div tw="mt-4">
                <Button
                  className="flex justify-center items-center gap-x-1 w-32"
                  primary
                  size="large"
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  data-test="system-settings-form:save-changes-button"
                >
                  {isSubmitting ? <Spinner disabled /> : "Save Changes"}
                </Button>
              </div>
              <UnlockingSystemSettingsFormModal
                isOpen={isUnlockingModalOpened}
                onToggle={setIsUnlockingModalOpened}
                setUnlocked={setUnlockedPackages}
              />
            </div>
          </div>
          <UnSaveChangeModal />
        </Form>
      )}
    </Formik>
  );
};
