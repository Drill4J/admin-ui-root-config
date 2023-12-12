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
import "twin.macro";
import { Switch } from "react-router-dom";
import { routes } from "common";
import { PrivateRoute, useSetPanelContext } from "components";
import { AdministratePage } from "pages/administrate-page";
import { Button, Icons, Stub } from "@drill4j/ui-kit";
import { AgentPage } from "../agent";
import { ServiceGroup } from "../service-group";

export const PageSwitcher = () => {
  const setPanel = useSetPanelContext();

  return (
    <Switch>
      <PrivateRoute
        exact
        path={routes.root}
        component={() => (
          <div tw="flex justify-center items-center h-full">
            <Stub
              icon={<Icons.NoAgentsPlaceholder />}
              title="Nothing to show yet"
              message={(
                <div>
                  To view application metrics open corresponding agent&apos;s page
                  <Button
                    primary
                    size="large"
                    tw="mt-5 mx-auto"
                    onClick={() => setPanel({ type: "SELECT_AGENT" })}
                    data-test="no-agent-selected-stub:open-select-agent-panel"
                  >
                    View agents
                  </Button>
                </div>
              )}
            />
          </div>
        )}
      />
      <PrivateRoute exact path={routes.administrate} component={AdministratePage} />
      <PrivateRoute path={[routes.agentPlugin, routes.agentDashboard]} component={AgentPage} />
      <PrivateRoute
        path={[routes.serviceGroupPlugin, routes.serviceGroupDashboard]}
        component={ServiceGroup}
      />
    </Switch>
  );
};
