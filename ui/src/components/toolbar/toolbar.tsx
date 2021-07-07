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
import {
  Route, useHistory, Link, useLocation, useParams, useRouteMatch, matchPath,
} from "react-router-dom";
import { Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { TOKEN_KEY } from "common/constants";
import { Notification } from "types/notificaiton";
import { useAdminConnection } from "hooks";
import { getPagePath, routes } from "common";
import { Breadcrumbs } from "modules";
import { NotificationsSidebar } from "./notifications-sidebar";

const NotificationCount = styled.div`
  ${tw`flex justify-center min-w-20px h-5 mr-4 ml-1 px-1 rounded-full`}
  ${tw`font-bold text-monochrome-default bg-monochrome-medium-tint`}
  ${({ unread }: { unread: boolean }) =>
    unread && tw`text-12 text-monochrome-white bg-red-default`}
`;

export const Toolbar = () => {
  const notifications =
    useAdminConnection<Notification[]>("/notifications") || [];
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );
  const { push } = useHistory();
  const { pathname } = useLocation();

  const {
    params: {
      agentId = "", buildVersion = "", pluginId = "", groupId = "",
    } = {},
  } = matchPath(pathname, {
    path: Object.values(routes),
  }) || {};
  const availableRoutes = Object
    .values(routes)
    .map(route => route
      .replace(":agentId", agentId)
      .replace(":buildVersion", buildVersion)
      .replace(":pluginId", pluginId)
      .replace(":groupId", groupId));

  return (
    <div tw="flex items-center w-full h-full">
      <div tw="flex items-center justify-between mx-6 w-full h-full">
        <div tw="text-monochrome-default">
          <Breadcrumbs
            pathname={pathname}
            render={(crumbs) => crumbs.map(
              (crumb, index) => {
                const CrumbLink = styled(Link)`
                  ${tw`inline-block max-w-200px
                    text-ellipsis align-middle
                    text-blue-default text-12
                    font-bold cursor-pointer no-underline
                  `};
                  ${({ isNotFound }: { isNotFound: boolean }) => isNotFound && tw`text-monochrome-default pointer-events-none`}
                `;
                const link = `/${crumbs.slice(0, index + 1).join("/")}`;
                return (
                  <CrumbLink
                    isNotFound={!availableRoutes.includes(link)}
                    key={crumb}
                    title={crumb}
                    to={link}
                  >
                    {crumb}
                  </CrumbLink>
                );
              },
            )}
          />
        </div>
        <div tw="flex items-center text-12 leading-20 text-monochrome-default">
          <Link
            to={`${pathname === "/" ? "" : pathname}/notification-sidebar`}
            className="link"
          >
            <Icons.Notification data-test="tolbar:icon-notification" />
          </Link>
          <NotificationCount
            unread={unreadNotifications.length > 0}
            data-test="tolbar:notification-count"
          >
            {unreadNotifications.length}
          </NotificationCount>
          <span tw="w-1px h-5 mr-4 bg-monochrome-medium-tint" />
          Signed in as Guest
          <div
            tw="ml-2 font-bold text-12 leading-20 text-blue-default cursor-pointer"
            className="link"
            onClick={() => {
              localStorage.removeItem(TOKEN_KEY);
              push(getPagePath({ name: "login" }));
            }}
            data-test="toolbar:sign-out"
          >
            Sign out
          </div>
        </div>
      </div>
      <Route
        path="*/notification-sidebar"
        render={() => <NotificationsSidebar notifications={notifications} />}
      />
    </div>
  );
};
