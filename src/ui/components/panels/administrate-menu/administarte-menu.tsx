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
import { useHistory } from "react-router-dom";
import { getPagePath } from "common";
import { userHasAdminRole } from "modules/auth/hooks/use-has-role";

export interface Props {
  close: () => void;
}

export const AdministrateMenu = () => {
  const { push } = useHistory();
  const { hasRole: hasAdminRole } = userHasAdminRole();

  return (
    <Menu>
      <div tw="overflow-hidden rounded-2xl">
        <div tw="flex flex-col gap-4 bg-monochrome-black py-6">
          <CategoryHeader>Administrate</CategoryHeader>
          { hasAdminRole !== null && !hasAdminRole &&
            <Text> You don&apos;t have necessary permissions to access administrative functions.</Text>}
          <ButtonLink
            disabled={!hasAdminRole}
            onClick={() => {
              push(getPagePath({ name: "administrate" }));
            }}
          >
            Manage Users
          </ButtonLink>
        </div>
      </div>
    </Menu>
  );
};

const Menu = styled.div`
  width: 310px;
  &::after {
    width: 6px;
    height: 6px;
    position: absolute;
    border: 6px solid transparent;
    content: '';
    bottom: 24px;
    left: -6px;
    border-right-color: #000000;
    border-left: none;
`;

const CategoryHeader = styled.h2`
  ${tw`flex px-6 py-2 leading-24 text-14 uppercase text-monochrome-gray font-bold`}
`;

const ButtonLink = styled.button`
  ${tw`flex w-full px-6 py-1 leading-20 text-14 text-monochrome-white hover:bg-monochrome-default/[0.1]`}
`;

const Text = styled.span`
  ${tw`flex px-6 leading-24 text-14 text-monochrome-gray`}
`;
