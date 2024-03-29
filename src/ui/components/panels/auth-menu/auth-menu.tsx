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
import { getPagePath, TOKEN_KEY } from "common";
import {
  addQueryParamsToPath,
} from "@drill4j/ui-kit";
import useUserInfo from "modules/auth/hooks/use-user-info";

export interface Props {
  close: () => void;
}

export const AuthMenu = ({ close }: Props) => {
  const { push } = useHistory();

  const { data: userInfo } = useUserInfo();

  return (
    <Menu>
      <div tw="overflow-hidden rounded-2xl">
        <div tw="flex flex-col gap-2 bg-monochrome-black py-6">
          <>
            { userInfo && (
              <CategoryHeader>
                Current user: {userInfo.username}
              </CategoryHeader>
            )}
          </>
          <ButtonLink
            onClick={() => {
              close();
              push(addQueryParamsToPath({ activeModal: "update-password" }));
            }}
          >
            Update Password
          </ButtonLink>

          <ButtonLink
            onClick={() => {
              localStorage.removeItem(TOKEN_KEY);
              push(getPagePath({ name: "login" }));
              close();
            }}
          >
            Sign out
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
  ${tw`flex px-6 py-2 leading-24 text-14 text-monochrome-gray font-bold`}
`;

const ButtonLink = styled.button`
  ${tw`flex w-full px-6 py-1 leading-20 text-14 text-monochrome-white hover:bg-monochrome-default/[0.1]`}
`;
