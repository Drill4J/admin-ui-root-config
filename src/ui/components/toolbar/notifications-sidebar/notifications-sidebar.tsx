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
import { nanoid } from "nanoid";
import {
  Icons, Panel, GeneralAlerts, useCloseModal,
} from "@drill4j/ui-kit";

import tw, { styled } from "twin.macro";

import { Notification as NotificationType } from "types/notificaiton";
import { Notification } from "./notification";
import { deleteAllNotifications, readAllNotifications } from "./api";

interface Props {
  notifications: NotificationType[];
}

export const NotificationsSidebar = ({ notifications }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const onToggle = useCloseModal("/notification-sidebar");

  return (
    <Panel onClose={onToggle}>
      <Panel.Content>
        <Panel.Header>
          <Header>
            <Icons.Notification />
            <span>Notifications</span>
          </Header>
        </Panel.Header>
        <Panel.Body>
          {notifications.length > 0 ? (
            <div tw="flex flex-col flex-grow overflow-y-hidden">
              <ActionsPanel>
                <span
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
                <GeneralAlerts type="ERROR">{errorMessage}</GeneralAlerts>
              )}
              <div tw="overflow-hidden overflow-y-auto">
                {notifications.map((notification) => (
                  <Notification notification={notification} key={nanoid()} />
                ))}
              </div>
            </div>
          ) : (
            <div tw="flex flex-grow flex-col justify-center items-center text-monochrome-medium-tint">
              <Icons.Notification width={120} height={130} />
              <div tw="mt-10 mb-2 text-24 leading-32 text-monochrome-medium-tint text-center">
                There are no notifications
              </div>
              <div tw="text-14 leading-24 text-monochrome-default text-center">
                No worries, we’ll keep you posted!
              </div>
            </div>
          )}
        </Panel.Body>
      </Panel.Content>
    </Panel>
  );
};

const Header = styled.div`
  ${tw`flex items-center space-x-2`}
  ${tw`text-18 leading-24 text-monochrome-black`}
`;

const ActionsPanel = styled.div`
  ${tw`flex justify-end items-center w-full`}
  ${tw`border-b border-monochrome-medium-tint font-bold text-12 leading-38 text-blue-default`}
  & > * {
    ${tw`mr-4 cursor-pointer hover:text-blue-medium-tint active:text-blue-shade`}
  }
`;
