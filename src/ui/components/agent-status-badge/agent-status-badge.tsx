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
import "twin.macro";

import { AgentStatus } from "types";
import { AGENT_STATUS } from "common";

/* eslint-disable max-len */

interface Props {
  status?: AgentStatus;
}

export const AgentStatusBadge = ({ status }: Props) => {
  if (status === AGENT_STATUS.ONLINE) {
    return (
      <Wrapper>
        <path fillRule="evenodd" clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM11.3454 6.70452C11.6165 6.39136 11.5824 5.91771 11.2692 5.64659C10.9561 5.37548 10.4824 5.40957 10.2113 5.72273L7.46856 8.89083L5.81611 7.19086C5.5274 6.89385 5.05258 6.88712 4.75556 7.17583C4.45855 7.46454 4.45181 7.93937 4.74053 8.23638L7.53253 11.1087L11.3454 6.70452Z" fill="#33C535" />
      </Wrapper>
    );
  }

  if (status === AGENT_STATUS.BUSY) {
    return (
      <Wrapper>
        <path fillRule="evenodd" clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM8.48828 4.99937C8.48793 4.58516 8.15186 4.24966 7.73765 4.25C7.32344 4.25035 6.98793 4.58642 6.98828 5.00063L6.99185 9.25763L10.5 9.25766C10.9142 9.25766 11.25 8.92188 11.25 8.50766C11.25 8.09345 10.9142 7.75766 10.5 7.75766L8.49059 7.75764L8.48828 4.99937Z" fill="#F5A623" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM9.72126 5.21967C10.0141 4.92678 10.489 4.92678 10.7819 5.21967C11.0748 5.51256 11.0748 5.98744 10.7819 6.28033L9.06139 8.00085L10.7818 9.72127C11.0747 10.0142 11.0747 10.489 10.7818 10.7819C10.4889 11.0748 10.014 11.0748 9.72114 10.7819L8.00073 9.06151L6.28044 10.7818C5.98755 11.0747 5.51268 11.0747 5.21978 10.7818C4.92689 10.4889 4.92689 10.014 5.21978 9.72114L6.94007 8.00085L5.21967 6.28045C4.92678 5.98756 4.92678 5.51269 5.21967 5.21979C5.51256 4.9269 5.98744 4.9269 6.28033 5.21979L8.00073 6.94019L9.72126 5.21967Z" fill="#A4ACB3" />
    </Wrapper>
  );
};

const Wrapper: React.FC = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" rx="8" fill="#2F2D2F" />
    {children}
  </svg>
);
