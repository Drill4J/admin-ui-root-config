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
import tw, { styled } from "twin.macro";

import { usePanelContext, useSetPanelContext } from "../panels";
import { Cube } from "../cubes";

export const Logout = () => {
  const openModal = useSetPanelContext();
  const activePane = usePanelContext();

  return (
    <Cube onClick={() => openModal({ type: "AUTH_MENU" })}>
      <div tw="text-monochrome-white">
        <Wrapper active={activePane?.type === "AUTH_MENU"}>
          <Icons.Account />
        </Wrapper>
      </div>
    </Cube>
  );
};

const Wrapper = styled.div`
  ${({ active }: { active: boolean }) => active && tw`text-blue-default`}
`;
