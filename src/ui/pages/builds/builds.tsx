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
  Table, Typography, dateTimeFormatter, Cells, Stub, Icons,
} from "@drill4j/ui-kit";
import { Link, useParams } from "react-router-dom";

import { BuildVersion } from "@drill4j/types-admin";
import tw, { styled, css } from "twin.macro";

import { useAdminConnection, useAgent } from "hooks";
import { AGENT_STATUS, getPagePath } from "common";

export const Builds = () => {
  const { agentId = "" } = useParams<{agentId?: string;}>();
  const builds = useAdminConnection<BuildVersion[]>(`/agents/${agentId}/builds`) || [];
  const agent = useAgent();

  return (
    <div tw="flex flex-col w-full h-full">
      <div tw="flex justify-between items-center py-8 px-6 space-x-2 text-24 leading-32 border-b border-monochrome-medium-tint">
        <div>
          <span>All Builds</span>
          <span tw="text-monochrome-default font-light">
            {builds.length}
          </span>
        </div>
        <SettingsButton
          tw="link"
          to={getPagePath({ name: "agentGeneralSettings", params: { agentId } })}
          disabled={agent.status === AGENT_STATUS.OFFLINE}
          data-test="builds:settings-button"
        >
          <Icons.Settings />
        </SettingsButton>
      </div>
      <div tw="px-6 flex-grow">
        <Table
          defaultSortBy={[{
            id: "detectedAt",
            desc: false,
          }]}
          renderHeader={({ currentCount, totalCount }) => (
            <div tw="flex justify-between text-monochrome-default text-14 leading-24 pt-9 pb-3">
              <div tw="font-bold uppercase">Builds list</div>
              <div>{`Displaying ${currentCount} of ${totalCount} builds`}</div>
            </div>
          )}
          stub={(
            <Stub
              icon={<Icons.BuildList height={104} width={107} />}
              title="No results found"
              message="Try adjusting your search or filter to find what you are looking for."
            />
          )}
          columns={[
            {
              Header: "Name",
              accessor: "buildVersion",
              filterable: true,
              isCustomCell: true,
              width: "60%",
              Cell: ({ value: buildVersion, state }: any) => (
                <NameCell title={buildVersion}>
                  <Link
                    tw="link text-ellipsis"
                    to={getPagePath({ name: "agentDashboard", params: { agentId, buildVersion } })}
                    data-test="builds-table:buildVersion"
                  >
                    <Typography.MiddleEllipsis>
                      <Cells.Highlight text={buildVersion} searchWords={state.filters.map((filter: {value: string}) => filter.value)} />
                    </Typography.MiddleEllipsis>
                  </Link>
                </NameCell>
              ),
              textAlign: "left",
            },
            {
              Header: "Added",
              accessor: "detectedAt",
              Cell: ({ value }: any) => {
                const date = dateTimeFormatter(value);
                return <span title={date}>{date}</span>;
              },
              textAlign: "left",
              width: "40%",
              sortType: "number",
            },
          ]}
          data={builds}
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

const SettingsButton = styled(Link)(({ disabled }: { disabled?: boolean }) => [
  disabled && tw`opacity-25 pointer-events-none`,
  css`
    & > svg {
      ${tw`w-8 h-8`}
    }
  `,
]);
