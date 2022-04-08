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
import { ContentAlert, Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { DarkDropdown } from "components";
import { useAdminConnection } from "hooks";
import { Notification as NotificationType } from "types";
import { PanelWithCloseIcon } from "../panel-with-close-icon";
import { PanelProps } from "../panel-props";
import { readAllNotifications } from "./api";
import { PanelStub } from "../../panel-stub";
import { getBuildNotification } from "./get-build-notification";

export const NotificationsPanel = ({ isOpen, onClosePanel }: PanelProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const notifications = useAdminConnection<NotificationType[]>("/notifications") || [];
  const unreadNotifications = notifications.filter(({ read }) => !read).length;
  const [filter, setFilter] = useState<any>("all");
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationType[]>([]);

  const notificationTypes = [
    {
      value: "all",
      label: "All Notifications",
    },
    {
      value: "BUILD",
      label: "Build",
    },
    {
      value: "AGENTS",
      label: "Agents",
    },
  ];

  useEffect(() => {
    if (filter === "all") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(notification => notification.type === filter));
    }
  }, [filter, notifications]);

  return (
    <PanelWithCloseIcon
      header={(
        <div tw="w-[400px] flex justify-between items-center h-20">
          <span>Notifications</span>
          <span tw="text-monochrome-gray">{unreadNotifications}</span>
        </div>
      )}
      isOpen={isOpen}
      onClosePanel={onClosePanel}
    >
      {notifications.length > 0 ? (
        <div tw="absolute inset-0 flex flex-col flex-grow overflow-y-hidden">
          <ActionsPanel>
            <DarkDropdown
              items={notificationTypes}
              onChange={(value => setFilter(value))}
              value={filter}
            />
            <span
              onClick={() =>
                readAllNotifications({ onError: setErrorMessage })}
              data-test="notification-sidebar:mark-all-as-read"
            >
              Mark all as read
            </span>
          </ActionsPanel>
          {errorMessage && (
            <ContentAlert type="ERROR">{errorMessage}</ContentAlert>
          )}
          <div className="custom-scroll" tw="overflow-hidden overflow-y-auto h-full">
            {filteredNotifications.map((notification) => {
              switch (notification.type) {
                case "BUILD":
                  return getBuildNotification(notification);
                  break;
                default:
                  return null;
                  break;
              }
            })}
          </div>
        </div>
      ) : (
        <PanelStub
          icon={<Icons.Notification width={120} height={130} />}
          title="There are no notifications"
          message="No worries, we’ll keep you posted!"
        />
      )}
    </PanelWithCloseIcon>
  );
};

const ActionsPanel = styled.div`
  ${tw`flex justify-between items-center w-full px-6 pt-4 pb-2 font-bold text-14 leading-32 text-blue-default`}
  & > * {
    ${tw`cursor-pointer hover:text-blue-medium-tint active:text-blue-shade`}
  }
`;
