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
import { useHistory } from "react-router-dom";
import {
  JavaAgentRegistrationPanel, AgentPreregistrationPanel, JsAgentRegistrationPanel, GroupRegistrationPanel,
} from "./registration";
import { SelectAgentPanel } from "./select-agent-panel";
import { SettingsPanel } from "./settings";
import { AddAgentPanel } from "./add-agent-panel";
import { NotificationsPanel } from "./notifications-panel";
import { usePanelContext, useSetPanelContext } from "./panel-context";

const panels = {
  JAVA_AGENT_REGISTRATION: JavaAgentRegistrationPanel,
  JS_AGENT_REGISTRATION: JsAgentRegistrationPanel,
  AGENT_PREREGISTRATION: AgentPreregistrationPanel,
  NOTIFICATIONS: NotificationsPanel,
  ADD_AGENT: AddAgentPanel,
  SELECT_AGENT: SelectAgentPanel,
  SETTINGS: SettingsPanel,
  GROUP_REGISTRATION: GroupRegistrationPanel,
};

export const Panels = () => {
  const activePanel = usePanelContext();
  const setActivePanel = useSetPanelContext();
  const { listen } = useHistory();

  useEffect(() => listen(() => {
    setActivePanel(null);
  }), []);

  if (!activePanel) {
    return null;
  }

  const Panel = panels[activePanel?.type];

  return <Panel isOpen onClosePanel={() => setActivePanel(null)} payload={activePanel?.payload} />;
};
