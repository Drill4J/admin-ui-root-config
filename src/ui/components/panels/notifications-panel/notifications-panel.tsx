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
import { ContentAlert, Icons } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";
import { Notification as NotificationType } from "types";
import { PanelWithCloseIcon } from "../panel-with-close-icon";
import { PanelProps } from "../panel-props";
import { deleteAllNotifications, readAllNotifications } from "./api";
import { Notification } from "./notification";
import { PanelStub } from "../../panel-stub";

interface NotificationsPanelProps extends PanelProps {
  payload: NotificationType[],
}

export const NotificationsPanel = ({ isOpen, onClosePanel, payload: notifications }: NotificationsPanelProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const unreadNotifications = notifications.filter(({ read }) => !read).length;

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
            <span
              tw="mr-4"
              onClick={() =>
                readAllNotifications({ onError: setErrorMessage })}
              data-test="notification-sidebar:mark-all-as-read"
            >
              Mark all as read
            </span>
            <span
              onClick={() =>
                deleteAllNotifications({ onError: setErrorMessage })}
              data-test="notification-sidebar:clear-all"
            >
              Clear all
            </span>
          </ActionsPanel>
          {errorMessage && (
            <ContentAlert type="ERROR">{errorMessage}</ContentAlert>
          )}
          <div className="custom-scroll" tw="overflow-hidden overflow-y-auto">
            {notifications.map((notification) => (
              <Notification notification={notification} key={notification.createdAt} />
            ))}
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
  ${tw`flex justify-end items-center w-full px-6 py-4 font-bold text-12 text-blue-default`}
  & > * {
    ${tw`cursor-pointer hover:text-blue-medium-tint active:text-blue-shade`}
  }
`;
