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

import { Link, useParams } from "react-router-dom";
import { Table } from "@drill4j/ui-kit";
import { BuildVersion } from "@drill4j/types-admin";
import { dateTimeFormatter } from "@drill4j/common-utils";
import tw, { styled } from "twin.macro";

import { useAdminConnection } from "hooks";
import { getPagePath } from "common";

export const Builds = () => {
  const { agentId = "" } = useParams<{agentId?: string;}>();
  const buildVersions = useAdminConnection<BuildVersion[]>(`/agents/${agentId}/builds`) || [];

  return (
    <div tw="mx-6">
      <div>
        <div tw="flex items-center gap-x-2 w-full my-6 font-light text-24 leading-32 text-monochrome-black">
          <span>All builds </span>
          <span tw="text-monochrome-default">{buildVersions.length}</span>
        </div>
        <Table
          isDefaulToggleSortBy
          columns={[
            {
              Header: "Name",
              accessor: "buildVersion",
              Cell: ({ value: buildVersion }: any) => (
                <NameCell title={buildVersion}>
                  <Link
                    tw="link text-ellipsis"
                    to={getPagePath({ name: "agentDashboard", params: { agentId, buildVersion } })}
                  >
                    {buildVersion}
                  </Link>
                </NameCell>
              ),
              textAlign: "left",
            },
            {
              Header: "Added",
              accessor: "detectedAt",
              Cell: ({ value }: any) => <span>{dateTimeFormatter(value)}</span>,
              textAlign: "left",
            },
          ]}
          data={buildVersions}
        />
      </div>
    </div>
  );
};

const NameCell = styled.div`
  ${tw`grid gap-x-2 h-12 items-center`}
  grid-template-columns: minmax(auto, max-content) max-content;
  ${tw`font-bold text-14`}
`;
