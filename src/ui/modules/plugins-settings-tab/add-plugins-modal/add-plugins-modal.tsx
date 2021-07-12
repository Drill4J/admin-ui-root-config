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
import { Modal, Button, Spinner } from "@drill4j/ui-kit";
import { matchPath, useLocation } from "react-router-dom";
import { useCloseModal } from "@drill4j/common-hooks";
import tw, { styled } from "twin.macro";

import { Plugin } from "types/plugin";
import { routes } from "common";
import { sendNotificationEvent } from "@drill4j/send-notification-event";
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
      sendNotificationEvent({ type: "SUCCESS", text: "Plugin has been added" });
    },
    onError: () => sendNotificationEvent({
      type: "ERROR",
      text: "On-submit error. Server problem or operation could not be processed in real-time",
    }),
  });

  return (
    <Modal isOpen onToggle={closeModal}>
      <div tw="flex flex-col h-full">
        <div tw="pt-4 pb-4 pr-6 pl-6 text-20 leading-32 text-monochrome-black border-b border-monochrome-medium-tint">
          Add new plugin
        </div>
        <div tw="h-full flex-grow pr-6 pl-6">
          <div tw="mt-4 font-bold text-14 leading-40 text-monochrome-black">Choose one or more plugins:</div>
          <PluginsList>
            <SelectableList
              plugins={plugins}
              selectedRows={selectedPlugins}
              handleSelect={setSelectedPlugins}
            />
          </PluginsList>
        </div>
        <div tw="flex items-center h-20 w-full gap-x-4 pl-6 bg-monochrome-light-tint">
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
            {loading ? <Spinner disabled /> : "Add plugin"}
          </Button>
          <Button secondary size="large" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
