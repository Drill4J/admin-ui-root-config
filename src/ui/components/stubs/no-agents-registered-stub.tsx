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
import { Button, Icons, Stub } from "@drill4j/ui-kit";
import "twin.macro";

import { useSetPanelContext } from "../panels";
import { NoAgentsSvg } from "./no-agents-svg";

export const NoAgentsRegisteredStub = () => {
  const setPanel = useSetPanelContext();
  return (
    <Stub
      icon={<NoAgentsSvg />}
      title="No registered agents at the moment"
      message={(
        <>
          <span>
           Refer to&nbsp;
            <a
              tw="inline-flex items-center gap-x-1 text-blue-default font-semibold"
              href="https://drill4j.github.io/docs/installation/setup"
              rel="noopener noreferrer"
              target="_blank"
            >
              Drill4J documentation  <Icons.OpenInNewTab tw="inline" />
            </a>
            &nbsp;for setup and configuration instructions
          </span>
          <Button
            primary
            size="large"
            tw="mt-12 mx-auto"
            onClick={() => setPanel({ type: "ADD_AGENT" })}
            data-test="no-agent-registered-stub:open-add-agent-panel"
          >
            <Icons.Plus /> Add Agent
          </Button>
        </>
      )}
    />
  );
};
