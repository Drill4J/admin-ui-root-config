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
import { FieldInputProps } from "formik";
import { Icons, Checkbox } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

interface Props {
  field?: FieldInputProps<any>;
  icon: keyof typeof Icons;
  description?: string;
  children?: React.ReactNode;
}

const PluginElements = styled.div`
  ${tw`flex items-center pr-4 pl-4 text-blue-default`};
  ${({ selected }: { selected?: boolean }) => selected && tw`bg-blue-light-tint`};
`;

const PluginsIconWrapper = styled.div`
  min-width: 80px;
  ${tw`flex items-center justify-center mt-4 mr-6 mb-4 ml-4 h-20 rounded-2xl bg-monochrome-light-tint text-monochrome-default`};
  ${({ selected }: { selected?: boolean }) => selected && tw`bg-blue-default text-monochrome-white`};
`;

export const PluginListEntry = ({
  field, description, icon, children,
}: Props) => {
  const PluginIcon = Icons[icon] || Icons.Plugins;
  return (
    <div css={[
      tw`border-b border-monochrome-medium-tint cursor-pointer`,
      tw`first:border-t border-monochrome-medium-tint`,
      tw`hover:bg-monochrome-light-tint`,
    ]}
    >
      <PluginElements selected={field?.checked}>
        {field && <Checkbox field={field} />}
        <PluginsIconWrapper selected={field?.checked}>
          <PluginIcon />
        </PluginsIconWrapper>
        <div>
          {children}
          <span tw="text-14 leading-20 text-monochrome-default">{description}</span>
        </div>
      </PluginElements>
    </div>
  );
};
