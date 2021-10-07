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
import {
  Button, capitalize, Formik, Form, formatPackages, parsePackages, composeValidators, requiredArray, sizeLimit, required, Spinner,
} from "@drill4j/ui-kit";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
import tw, { styled } from "twin.macro";
import { useAdminConnection } from "hooks";
import { Agent } from "types";
import { PanelProps } from "../panel-props";
import { PanelWithCloseIcon } from "../panel-with-close-icon";
import { GeneralSettingsForm } from "./agent-settings/general-settings-form";
import { JsSystemSettingsForm } from "./agent-settings/js-system-settings-form";
import { SystemSettingsForm } from "./agent-settings/system-settings-form";
import { PluginsSettingsTab } from "./agent-settings/plugins-settings-tab";
import { UnSaveChangesModal } from "./un-save-changes-modal";

export const SettingsPanel = ({ isOpen, onClosePanel, payload }: PanelProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [nextTab, setNextTab] = useState("");
  const agent = useAdminConnection<Agent>(`/api/agents/${payload}`) || {};
  const SystemSettings = agent.agentType === "Node.js" ? JsSystemSettingsForm : SystemSettingsForm;

  const handleSubmit = async (values: Agent) => {
    try {
      await saveSettings(activeTab, values);
      sendNotificationEvent({ type: "SUCCESS", text: "New settings have been saved" });
    } catch ({ response: { data: { message } = {} } = {} }) {
      sendNotificationEvent({
        type: "ERROR",
        text: message || "On-submit error. Server problem or operation could not be processed in real-time",
      });
    }
  };
  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        ...agent,
        systemSettings: {
          ...agent.systemSettings,
          packages: Array.isArray(agent.systemSettings?.packages)
            ? formatPackages(agent.systemSettings?.packages)
            : agent.systemSettings?.packages,
        },
      }}
      validate={getTabValidationSchema(activeTab)}
      enableReinitialize
    >
      {({
        isSubmitting, isValid, dirty, resetForm,
      }) => (
        <PanelWithCloseIcon
          header={(
            <div tw="space-y-8 pt-6 pb-3 w-[1024px]">
              <div tw="">Settings: {capitalize(payload)}</div>
              <div tw="flex justify-center gap-x-6">
                {["general", "system", "plugins"].map((tab) => (
                  <Tab
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => {
                      if (dirty) {
                        setNextTab(tab);
                      } else setActiveTab(tab);
                    }}
                  >
                    {tab}
                  </Tab>
                ))}
              </div>
            </div>
          )}
          isOpen={isOpen}
          onClosePanel={onClosePanel}
        >
          <Form tw="flex flex-col items-center py-16 space-y-8">
            {activeTab === "general" && <GeneralSettingsForm />}
            {activeTab === "system" && <SystemSettings />}
            {activeTab === "plugins" && <PluginsSettingsTab agent={agent} />}
            {activeTab !== "plugins" && (
              <Button
                tw="min-w-[130px]"
                primary
                size="large"
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                data-test="save-changes-button"
              >
                {isSubmitting ? <Spinner /> : "Save Changes"}
              </Button>
            )}
            <UnSaveChangesModal
              isOpen={Boolean(nextTab)}
              onToggle={() => setNextTab("")}
              onLeave={() => { resetForm(); setNextTab(""); setActiveTab(nextTab); }}
            />
          </Form>
        </PanelWithCloseIcon>
      )}
    </Formik>
  );
};
// MOVE to ui-ki
const Tab = styled.div`
  ${tw`
      relative inline-flex text-14 leading-20 text-monochrome-default font-bold cursor-pointer capitalize
      hover:text-blue-medium-tint
  `};

  ${({ active }: { active: boolean }) => active && tw`
    text-blue-default
    after:(content block absolute top-7 h-1 w-full bg-blue-default rounded-t-lg)
  `}
`;

function saveSettings(activeTab: string, values: Agent): undefined | Promise<any> {
  const {
    id, name, agentType, description, environment, systemSettings: { sessionIdHeaderName, packages = "", targetHost } = {},
  } = values;
  // fix this
  const systemSettings = agentType === "Node.js"
    ? { targetHost }
    : {
      packages: Array.isArray(packages) ? packages : parsePackages(packages).filter(Boolean),
      sessionIdHeaderName,
      targetHost,
    };

  switch (activeTab) {
    case "general": return axios.patch(`/agents/${id}/info`, { name, description, environment });
    case "system": return axios.put(`/agents/${id}/system-settings`, systemSettings);
    default: return undefined;
  }
}

function getTabValidationSchema(activeTab: string) {
  switch (activeTab) {
    case "general": return composeValidators(
      required("name"),
      sizeLimit({ name: "name" }),
      sizeLimit({ name: "environment" }),
      sizeLimit({ name: "description", min: 3, max: 256 }),
    );
    case "system": return composeValidators(
      requiredArray("systemSettings.packages", "Path prefix is required."),
      sizeLimit({
        name: "systemSettings.sessionIdHeaderName",
        alias: "Session header name",
        min: 1,
        max: 256,
      }),
    );
    default: return undefined;
  }
}
