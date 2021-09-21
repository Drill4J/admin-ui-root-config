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
import React, {
  useEffect, useRef, useState,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Icons, Button, GeneralAlerts, requiredArray,
  composeValidators, required, sizeLimit, toError, FormValidator,
  parsePackages, getPropertyByPath,
} from "@drill4j/ui-kit";
import "twin.macro";

import {
  PageHeader, Wizard, Step,
} from "components";
import { useAgent } from "hooks";
import { CancelAgentRegistrationModal, InstallPluginsStep, SystemSettingsStep } from "modules";
import { Agent } from "types/agent";
import { getPagePath } from "common";
import { JavaGeneralRegistrationForm } from "./java-general-registration-form";
import { JsGeneralRegistrationForm } from "./js-general-registration-form";
import { JsSystemRegistrationForm } from "./js-system-registration-form";

interface Props {
  isOfflineAgent?: boolean;
}

const idValidator = (id: string, alias?: string): FormValidator => {
  const idRegexp = /^[a-z0-9-]{1,32}$/;
  return (validationItem: any) => (!idRegexp.exec(getPropertyByPath(validationItem, id))
    ? toError(id, `Incorrect ${alias}. Use lowercase Latin letters, digits and dashes.`)
    : undefined);
};

export const AgentRegistrationPage = ({ isOfflineAgent }: Props) => {
  const { agentId = "" } = useParams<{ agentId: string }>();
  const { push } = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { buildVersion = "", plugins = [], ...agent } = useAgent() || {};
  const [isCancelModalOpened, setIsCancelModalOpened] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <PageHeader
        title={(
          <div className="flex items-center gap-x-4">
            <Icons.Register height={20} width={20} />
            {agentId ? `${agent.agentType} Agent Registration` : "Offline Agent Preregistration"}
          </div>
        )}
        actions={(
          <div className="flex justify-end items-center w-full">
            <Button secondary size="large" onClick={() => setIsCancelModalOpened(true)}>
              Abort {agentId ? "Registration" : "Preregistration"}
            </Button>
          </div>
        )}
      />
      <Wizard
        initialValues={agent}
        onSubmit={async (data: Agent) => {
          if (agentId) {
            await registerAgent(data);
            if (isMounted.current) {
              if (data.plugins?.length === 1) {
                const [plugin] = data.plugins;
                push(getPagePath({ name: "agentPlugin", params: { agentId, buildVersion, pluginId: String(plugin) } }));
              } else {
                push(getPagePath({ name: "agentDashboard", params: { agentId, buildVersion } }));
              }
            }
          } else {
            await preregisterOfflineAgent(data);
            push(getPagePath({ name: "agentsTable" }));
          }
        }}
        onSuccessMessage={agentId ? "Agent has been registered" : "Offline agent has been preregistered"}
        isOfflineAgent={isOfflineAgent}
      >
        <Step
          name="General Settings"
          component={agent.agentType === "Node.js" ? JsGeneralRegistrationForm : JavaGeneralRegistrationForm}
          validate={composeValidators(
            !agentId && idValidator("id", "Agent ID"),
            !agentId && required("id", "Agent ID"),
            !agentId && sizeLimit({
              name: "id", alias: "Agent ID", min: 3, max: 32,
            }),
            required("name"),
            sizeLimit({ name: "name" }),
            sizeLimit({ name: "environment" }),
            sizeLimit({ name: "description", min: 3, max: 256 }),
          )}
        />
        <Step
          name="System settings"
          component={agent.agentType === "Node.js" ? JsSystemRegistrationForm : SystemSettingsStep}
          validate={agent.agentType === "Node.js"
            ? composeValidators(!agent.group && required("systemSettings.targetHost", "Target Host"))
            : composeValidators(
              requiredArray("systemSettings.packages", "Path prefix is required."),
              sizeLimit({
                name: "systemSettings.sessionIdHeaderName",
                alias: "Session header name",
                min: 1,
                max: 256,
              }),
            )}
        />
        <Step
          name="Plugins"
          component={({ formValues }) => (
            <InstallPluginsStep
              formValues={formValues}
              infoPanel={(
                <GeneralAlerts type="INFO">
                  Choose plugins to install on your agent. You will also be able to add them later on Agent’s page.
                </GeneralAlerts>
              )}
            />
          )}
        />
      </Wizard>
      {isCancelModalOpened && (
        <CancelAgentRegistrationModal
          isOpen={isCancelModalOpened}
          onToggle={setIsCancelModalOpened}
          header={`Abort ${agentId ? "Registration" : "Preregistration"}`}
          message={`Are you sure you want to abort ${agentId
            ? "agent registration"
            : "offline agent preregistration"}? All your progress will be lost.`}
        />
      )}
    </div>
  );
};

async function preregisterOfflineAgent({
  id,
  name,
  environment,
  description,
  plugins,
  systemSettings,
}: Agent) {
  await axios.post("/agents", {
    id,
    name,
    agentType: "JAVA",
    environment,
    description,
    plugins,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(systemSettings?.packages).filter(Boolean),
    },
  });
}

async function registerAgent({
  id,
  name,
  environment,
  description,
  plugins,
  systemSettings,
}: Agent) {
  await axios.patch(`/agents/${id}`, {
    name,
    environment,
    description,
    plugins,
    systemSettings: {
      ...systemSettings,
      packages: parsePackages(systemSettings?.packages).filter(Boolean),
    },
  });
}
