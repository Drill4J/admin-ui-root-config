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
import { Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { SelectAgent } from "./select-agent";
import { PluginsSelector } from "./plugins-selector";
import { Notifications } from "./notifications";
import { Logout } from "./logout";
import { SelectedEntity } from "./selected-entity";
import { MenuLinks } from "../menu-links";
import { Administrate } from "./administrate";

export const Navigation = (props: any) => (
  <div tw="flex flex-col w-12 h-full px-[6px] bg-monochrome-black" {...props}>
    <div tw="flex justify-center items-center w-full h-22 flex-grow-0 text-monochrome-white">
      <Icons.TransparentLogo width={24} height={24} viewBox="0 0 24 24" />
    </div>
    <ActionsWrapper>
      <SelectAgent />
      <SelectedEntity />
      <PluginsSelector />
      <div tw="mt-2 space-y-2">
        <Notifications />
        <MenuLinks />
        <Administrate />
        <Logout />
      </div>
    </ActionsWrapper>
  </div>
);

const ActionsWrapper = styled.div`
  ${tw`grid gap-y-4 py-4 flex-grow min-h-[1px]`}
  grid-template-rows: repeat(2, 36px) 1fr auto;
`;
