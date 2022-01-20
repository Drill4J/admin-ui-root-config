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
import {
  Panel, Button, Spinner, useCloseModal,
} from "@drill4j/ui-kit";
import { matchPath, useLocation } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { Plugin } from "types/plugin";
import { routes } from "common";
import { sendAlertEvent } from "@drill4j/send-alert-event";
import { SelectableList } from "./selectable-list";
import { loadPlugins } from "./load-plugins";

interface Props {
  plugins: Plugin[];
  selectedPlugins: string[];
  setSelectedPlugins: (plugins: string[]) => void;
}

const PluginsList = styled.div`
  height: calc(100% - 200px);
  width: 100%;
  overflow: auto;
  border-radius: 4px;
  ${tw`border border-monochrome-medium-tint`};
  ${tw`bg-monochrome-white`};
`;

export const AddPluginsModal = ({
  plugins, setSelectedPlugins, selectedPlugins,
}: Props) => {
  const { pathname } = useLocation();
  const { params: { agentId = "", groupId = "" } = {} } = matchPath<{
    agentId?: string; groupId?: string; }>(pathname, { path: [routes.agentPluginsSettings, routes.serviceGroupPluginsSettings] }) || {};
  const [loading, setLoading] = useState(false);
  const closeModal = useCloseModal("/add-plugin-modal");
  const handleLoadPlugins = loadPlugins(agentId ? `/agents/${agentId}/plugins` : `/groups/${groupId}/plugins`, {
    onSuccess: () => {
      closeModal();
      sendAlertEvent({ type: "SUCCESS", title: "Plugin has been added" });
    },
    onError: () => sendAlertEvent({
      type: "ERROR",
      title: "On-submit error. Server problem or operation could not be processed in real-time",
    }),
  });

  return (
    <Panel onClose={closeModal}>
      <Panel.Content>
        <Panel.Header tw="text-20 leading-32 text-monochrome-black">
          Add new plugin
        </Panel.Header>
        <Panel.Body tw="px-6">
          <div tw="mt-4 font-bold text-14 leading-40 text-monochrome-black">Choose one or more plugins:</div>
          <PluginsList>
            <SelectableList
              plugins={plugins}
              selectedRows={selectedPlugins}
              handleSelect={setSelectedPlugins}
            />
          </PluginsList>
        </Panel.Body>
        <Panel.Footer tw="flex items-center h-20 w-full gap-x-4">
          <Button
            className="flex justify-center items-center gap-x-1 w-27"
            primary
            size="large"
            onClick={async () => {
              setLoading(true);
              await handleLoadPlugins(selectedPlugins);
              setLoading(false);
            }}
            disabled={selectedPlugins.length === 0 || loading}
          >
            {loading ? <Spinner /> : "Add plugin"}
          </Button>
          <Button secondary size="large" onClick={closeModal}>
            Cancel
          </Button>
        </Panel.Footer>
      </Panel.Content>
    </Panel>
  );
};
