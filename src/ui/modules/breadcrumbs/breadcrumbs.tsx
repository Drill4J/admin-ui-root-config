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
import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { routes } from "common";
import { usePluginUrls } from "hooks";

interface Props {
  pathname: string;
}

export const Breadcrumbs = ({ pathname }: Props) => {
  const [pluginsRoutes, setPluginsRoutes] = useState<string[]>([]);
  const paths = usePluginUrls();

  useEffect(() => {
    if (!paths) return;

    (async () => {
      const modules = await Promise
        .all(Object
          .values(paths)
          .map(pluginPath => System.import(pluginPath)));

      setPluginsRoutes(
        modules
          .map(({ Routes }) =>
            Object
              .values(Routes)
              .map((route) => `${routes.agentPlugin}${route}`))
          .flat(),
      );
    })();
  }, [paths]);

  const {
    params: {
      agentId = "",
      buildVersion = "",
      pluginId = "",
      groupId = "",
      scopeId = "",
    } = {},
  } = matchPath(pathname, {
    path: [...pluginsRoutes, ...Object.values(routes)],
  }) || {};

  const availableRoutes = [...pluginsRoutes, ...Object.values(routes)].map((route) =>
    route
      .replace(":agentId", agentId)
      .replace(":buildVersion", buildVersion)
      .replace(":pluginId", pluginId)
      .replace(":groupId", groupId)
      .replace(":scopeId", scopeId));

  const crumbs = pathname.slice(1).split("/");
  return (
    <BreadcrumbsContainer>
      {crumbs.map((crumb, index) => {
        const link = `/${crumbs.slice(0, index + 1).join("/")}`;
        return (
          <CrumbLink key={crumb} disable={!availableRoutes.includes(link)}>
            <Link
              title={crumb}
              to={link}
            >
              {crumb}
            </Link>
          </CrumbLink>
        );
      })}
    </BreadcrumbsContainer>
  );
};

const BreadcrumbsContainer = styled.div`
  & > * {
    :last-child {
      ${tw`text-monochrome-default pointer-events-none`};
    }

    :not(:first-child):before {
      padding: 0 8px;
      ${tw`text-monochrome-default`};
      content: "/";
    }

    :not(:last-child) {
      &:hover {
        ${tw`text-blue-medium-tint`};
      }

      &:active {
        ${tw`text-blue-shade`};
      }
    }
  }
`;

const CrumbLink = styled.div`
  ${tw`inline-block max-w-200px
      text-ellipsis align-middle
      text-blue-default text-12
      font-bold cursor-pointer no-underline
  `};
  ${({ disable }: { disable: boolean }) =>
    disable && tw`text-monochrome-default pointer-events-none`}
`;
