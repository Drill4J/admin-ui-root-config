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
  createContext, Dispatch, SetStateAction, useContext, useState,
} from "react";

export type PanelsType = "NOTIFICATIONS"
| "ADD_AGENT"
| "SELECT_AGENT"
| "JAVA_AGENT_REGISTRATION"
| "OFFLINE_AGENT_PREREGISTRATION"
| "JS_AGENT_REGISTRATION"
| "SETTINGS"

interface Panel {
  type: PanelsType;
  payload?: string;
}

export const PanelContext = createContext<Panel | null>(null);

export const SetPanelContext = createContext<Dispatch<SetStateAction<Panel | null>>>(() => {});

export function usePanelContext() {
  return useContext(PanelContext);
}

export function useSetPanelContext() {
  return useContext(SetPanelContext);
}

export const PanelProvider = ({ children }: {children: React.ReactNode}) => {
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);

  return (
    <PanelContext.Provider value={selectedPanel}>
      <SetPanelContext.Provider value={setSelectedPanel}>
        {children}
      </SetPanelContext.Provider>
    </PanelContext.Provider>
  );
};
