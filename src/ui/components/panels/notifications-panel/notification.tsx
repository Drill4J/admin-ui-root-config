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
import { format } from "timeago.js";
import { Icons, Typography, useHover } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

import { Notification as NotificationType } from "types";
import { getPagePath } from "common";
import { readNotification, deleteNotification } from "./api";

interface Props {
  notification: NotificationType;
  onError?: (message: string) => void;
}

export const Notification = ({
  notification: {
    agentId = "",
    createdAt,
    read,
    id = "",
    message: { currentId: buildVersion = "" } = {},
  },
  onError,
}: Props) => {
  const { ref, isVisible } = useHover();
  return (
    <Content ref={ref}>
      <div tw="flex justify-between items-center w-full leading-16 text-monochrome-gray">
        <span tw="truncate" title={agentId}>{agentId}</span>
        <SinceNotificationArrived isHover={isVisible}>
          {format(createdAt || Date.now())}
        </SinceNotificationArrived>
      </div>
      <BuildVersion unread={!read}>
        <span tw="flex items-center w-full" title={`Build ${buildVersion}`}>
          <NotificationStatusIndicator tw="mr-2" unread={!read} />
          <Typography.MiddleEllipsis tw="inline">
            <span tw="whitespace-nowrap">Build {buildVersion} arrived</span>
          </Typography.MiddleEllipsis>
        </span>
        <div
          css={[
            tw`hidden justify-end gap-x-4 items-center`,
            isVisible && tw`flex`,
          ]}
        >
          <MarkAsReadButton
            className="link"
            onClick={() => readNotification(id, { onError })}
            read={read}
            data-test="notification:mark-as-read-button"
          >
            <Icons.Success />
          </MarkAsReadButton>
          <DeleteNotificationButton
            onClick={() => deleteNotification(id, { onError })}
            data-test="notification:delete-notification-button"
          >
            <Icons.Cancel />
          </DeleteNotificationButton>
        </div>
      </BuildVersion>
      <div className="flex gap-x-4 font-bold h-4">
        <a
          className="link"
          href={getPagePath({ name: "agentDashboard", params: { agentId } })}
          target="_blank"
          rel="noopener noreferrer"
          data-test="notification:notification-button-dashboard"
        >
          Dashboard
        </a>
        <div
          tw="text-blue-default opacity-50 cursor-not-allowed"
          data-test="notification:notification-button-whats-new"
        >
          What’s new
        </div>
      </div>
    </Content>
  );
};

const Content = styled.div`
  ${tw`flex flex-col justify-center gap-y-2 pt-1 px-6 pb-2 h-20`}
  ${tw`text-12 text-monochrome-default border-b border-monochrome-dark first:border-t`}
  ${tw`hover:(bg-monochrome-default bg-opacity-5)`}
`;

const BuildVersion = styled.div(({ unread }: { unread?: boolean }) => [
  tw`grid grid-cols-[336px 48px] gap-4 leading-20 text-monochrome-light-tint text-14`,
  unread && tw`font-bold`,
]);

const NotificationStatusIndicator = styled.div(
  ({ unread }: { unread?: boolean }) => [
    tw`min-w-8px h-2 rounded bg-monochrome-gray`,
    unread && tw`bg-blue-default`,
  ],
);

const SinceNotificationArrived = styled.div`
  ${tw`h-4 min-w-[100px] text-right`}
  ${({ isHover }: { isHover: boolean }) =>
    isHover &&
    `
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      background: linear-gradient(90deg,currentColor 40%,transparent 80%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
  `}
`;

const MarkAsReadButton = styled.div(({ read }: { read?: boolean }) => [
  tw`h-4 cursor-pointer`,
  read && tw`hidden`,
]);

const DeleteNotificationButton = styled.div`
  ${tw`h-4 cursor-pointer text-red-default hover:text-red-medium-tint active:text-red-shade`}
`;
