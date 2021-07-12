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
import { Icons, Tooltip } from "@drill4j/ui-kit";
import "twin.macro";
import { useLocation } from "react-router-dom";

import { SidebarLink } from "components";

export interface Link {
  id: string;
  name: keyof typeof Icons;
  path: string;
}

interface Props {
  active?: "active";
  links: Link[];
  matchParams?: { path: string };
}

export const Sidebar = ({ links }: Props) => {
  const { pathname } = useLocation();
  return (
    <div tw="flex flex-col w-20 h-full bg-monochrome-light-tint">
      {links.map(({
        name, id, path,
      }) => {
        const Icon = Icons[name] || Icons.Plugins;
        return (
          <Tooltip message={<div>{name}</div>} position="right" key={id}>
            <SidebarLink
              isActive={id === "dashboard" ? !pathname.match("dashboard\\/\\w") : pathname.includes(path)}
              to={path}
            >
              <Icon />
            </SidebarLink>
          </Tooltip>
        );
      })}
    </div>
  );
};
