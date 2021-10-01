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
/* eslint-disable max-len */
import React from "react";
import { Icons, Field, Checkbox } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { PluginCard } from "components";
import { useAdminConnection } from "hooks";
import { Plugin } from "types";

export const InstallPluginsStep = (Props: any) => {
  const availablePlugins = useAdminConnection<Plugin[]>("/plugins");

  if (!availablePlugins) return null;
  return (
    <div tw="px-6 space-y-2">
      <div tw="flex justify-between text-14 leading-24 text-monochrome-gray">
        <span>Choose at least one plugin to install on your Agent (you will also be able to add them later in Agent’s settings):</span>
        <span><Field name="plugins">{({ field }: any) => <span>{field?.value?.length || 0}</span>}</Field> of {availablePlugins.length} selected</span>
      </div>
      <div role="group" aria-labelledby="checkbox-group">
        {availablePlugins.map(({
          id, name, description, version,
        }) => (
          <label key={id}>
            <Field
              type="checkbox"
              name="plugins"
              value={id}
            >
              {({ field }: any) => (
                <PluginWrapper selected={field?.checked}>
                  <PluginCard
                    name={name}
                    version={version}
                    icon={name as keyof typeof Icons}
                    description={description}
                    checkbox={<Checkbox field={field} tw="text-blue-default" />}
                  />
                </PluginWrapper>
              )}
            </Field>
          </label>
        ))}
      </div>
    </div>
  );
};

const PluginWrapper = styled.div`
  ${tw`border border-monochrome-dark100 rounded-lg hover:(border-blue-default border-opacity-50)`}
  ${({ selected }: { selected: boolean }) => selected && tw`border-blue-default`}
`;
