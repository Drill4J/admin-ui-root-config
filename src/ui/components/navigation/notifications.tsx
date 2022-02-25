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
import { useAdminConnection } from "hooks";
import { Notification as NotificationType } from "types";
import tw, { styled } from "twin.macro";

import { Cube } from "../cubes";
import { usePanelContext, useSetPanelContext } from "../panels";
import { IndicatorInEdge } from "../indicator-in-edge";

export const Notifications = () => {
  const openModal = useSetPanelContext();
  const activePane = usePanelContext();
  const notifications = useAdminConnection<NotificationType[]>("/notifications") || [];
  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <Cube
      isActive={activePane?.type === "NOTIFICATIONS"}
      onClick={() => openModal({ type: "NOTIFICATIONS", payload: notifications })}
    >
      <div tw="text-monochrome-black">
        <Indicator
          isCentered={unreadNotifications.length > 99}
          position="top-right"
          isHidden={!unreadNotifications.length}
          indicatorContent={(
            <NotificationsCount tw="min-w-[19px] h-5 flex justify-center items-center px-1 py-[2px]">
              {unreadNotifications.length > 99 ? "99+" : unreadNotifications.length}
            </NotificationsCount>
          )}
        >
          <Icons.Notification tw="text-monochrome-white" />
        </Indicator>
      </div>
    </Cube>
  );
};

const NotificationsCount = styled.div`
  ${tw`rounded-full bg-blue-default text-12 leading-14 text-monochrome-white box-border border-2 border-monochrome-black`}
`;

const Indicator = styled(IndicatorInEdge)(({ isCentered }: {isCentered: boolean}) => [isCentered && tw`right-2`]);
