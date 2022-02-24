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
  Button,
  composeValidators,
  Form,
  formatPackages,
  Formik,
  parsePackages,
  required,
  requiredArray,
  sendAlertEvent,
  sizeLimit,
  Spinner,
  Tab,
} from "@drill4j/ui-kit";
import "twin.macro";
import { AgentInfoWithSystemSetting } from "types";
import { AGENT_STATUS } from "common";
import { PanelProps } from "../panel-props";
import { PanelWithCloseIcon } from "../panel-with-close-icon";
import { GeneralSettingsForm } from "./agent-settings/general-settings-form";
import { JsSystemSettingsForm } from "./agent-settings/js-system-settings-form";
import { SystemSettingsForm } from "./agent-settings/system-settings-form";
import { PluginsSettingsTab } from "./agent-settings/plugins-settings-tab";
import { UnSaveChangesModal } from "./un-save-changes-modal";
import { saveSettingForPreregisteredAgent } from "./save-settings-api";

export const SettingsPanel = ({
  isOpen,
  onClosePanel,
  payload,
}: PanelProps) => {
  const [activeTab, setActiveTab] = useState(payload.tab || "general");
  const [nextTab, setNextTab] = useState("");
  const SystemSettings =
    payload.agentType === "Node.js" ? JsSystemSettingsForm : SystemSettingsForm;

  const handleSubmit = async (values: AgentInfoWithSystemSetting, { resetForm }: any) => {
    try {
      await saveSettings(activeTab, values);
      sendAlertEvent({
        type: "SUCCESS",
        title: "New settings have been saved",
      });
      resetForm({ values });
    } catch ({ response: { data: { message } = {} } = {} }) {
      sendAlertEvent({
        type: "ERROR",
        title:
          message ||
          "On-submit error. Server problem or operation could not be processed in real-time",
      });
    }
  };
  return (
    <Formik
      onSubmit={handleSubmit as any}
      initialValues={{
        ...payload,
        systemSettings: {
          ...payload.systemSettings,
          packages: (Array.isArray(payload.systemSettings?.packages)
            ? formatPackages(payload.systemSettings?.packages)
            : payload.systemSettings?.packages) as any,
        },
      }}
      validate={getTabValidationSchema(activeTab) as any}
      enableReinitialize
    >
      {({
        isSubmitting, isValid, dirty, resetForm, values,
      }) => (
        <PanelWithCloseIcon
          header={(
            <div tw="space-y-8 pt-6 w-[1024px]">
              <div tw="flex">Settings:&nbsp;<span title={payload.id} tw="truncate">{payload.id}</span></div>
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
          <Form tw="flex flex-col items-center py-16">
            <div tw="space-y-8">
              {activeTab === "general" && <GeneralSettingsForm />}
              {activeTab === "system" && <SystemSettings />}
              {activeTab === "plugins" && <PluginsSettingsTab agent={values} />}
              {activeTab !== "plugins" && (
                <Button
                  tw="flex justify-center min-w-[130px]"
                  primary
                  size="large"
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  data-test="save-changes-button"
                >
                  {isSubmitting ? <Spinner /> : "Save Changes"}
                </Button>
              )}
            </div>
            <UnSaveChangesModal
              isOpen={Boolean(nextTab)}
              onToggle={() => setNextTab("")}
              onLeave={() => {
                resetForm();
                setNextTab("");
                setActiveTab(nextTab);
              }}
            />
          </Form>
        </PanelWithCloseIcon>
      )}
    </Formik>
  );
};

// TODO refactor to different functions

function saveSettings(
  activeTab: string,
  values: AgentInfoWithSystemSetting,
): undefined | Promise<any> {
  const {
    id,
    name,
    agentType,
    description,
    environment,
    systemSettings: { sessionIdHeaderName, packages = "", targetHost } = {},
  } = values;
  if (values?.agentStatus === AGENT_STATUS.PREREGISTERED) {
    return saveSettingForPreregisteredAgent(values);
  }

  const systemSettings =
    agentType === "Node.js"
      ? { targetHost }
      : {
        packages: Array.isArray(packages)
          ? packages
          : parsePackages(packages).filter(Boolean),
        sessionIdHeaderName,
        targetHost,
      };

  switch (activeTab) {
    case "general":
      return agentType === "Group"
        ? axios.put(`/groups/${id}`, { name, description, environment })
        : axios.patch(`/agents/${id}/info`, { name, description, environment });
    case "system":
      return axios.put(
        `/${agentType === "Group" ? "groups" : "agents"}/${id}/system-settings`,
        systemSettings,
      );
    default:
      return undefined;
  }
}

function getTabValidationSchema(activeTab: string) {
  switch (activeTab) {
    case "general":
      return composeValidators(
        required("name"),
        sizeLimit({ name: "name" }),
        sizeLimit({ name: "environment" }),
        sizeLimit({ name: "description", min: 3, max: 256 }),
      );
    case "system":
      return composeValidators(
        requiredArray("systemSettings.packages", "Path prefix is required."),
        sizeLimit({
          name: "systemSettings.sessionIdHeaderName",
          alias: "Session header name",
          min: 1,
          max: 256,
        }),
      );
    default:
      return undefined;
  }
}
