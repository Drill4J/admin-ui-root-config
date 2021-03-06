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
import tw, { styled } from "twin.macro";
import { Notification as NotificationType } from "types";
import { getRoutePath } from "common";
import { Notification } from "./notification";
import { toggleNotification } from "./api";

export function getBuildNotification({
  id = "", read = true, agentId, agentName, createdAt, message: { currentId: buildVersion = "" } = {},
}: NotificationType) {
  const title = `Build ${buildVersion} deployed.`;
  const info = `Agent: ${agentName || agentId}`;
  const link = (
    <Link
      href={getRoutePath(`/agents/${agentId}/plugins/test2code/builds/${buildVersion}/overview`)}
      target="_blank"
      rel="noopener noreferrer"
      data-test="notification:notification-button-dashboard"
      onClick={() => toggleNotification(id, true)}
    >
      Go to Build
    </Link>
  );

  return (<Notification key={id} id={id} read={read} title={title} info={info} date={createdAt} link={link} />);
}

const Link = styled.a`
  ${tw`text-12 leading-24 font-bold text-blue-default`}
  ${tw`hover:text-blue-medium-tint`}
`;
