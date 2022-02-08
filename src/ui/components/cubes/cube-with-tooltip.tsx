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
import { Tooltip } from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";

interface Props {
  isActive?: boolean;
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

export const CubeWithTooltip = ({
  isActive, children, tooltip, onClick, ...rest
}: Props) => (
  <Tooltip message={tooltip} position="right" tw="ml-1">
    <Cube isActive={isActive} onClick={onClick} {...rest}>
      {children}
    </Cube>
  </Tooltip>
);

export const Cube = styled.div(({ isActive }: {isActive?: boolean}) => [
  tw`flex justify-center items-center w-9 h-9 rounded text-monochrome-white cursor-pointer uppercase`,
  tw`bg-transparent hover:(bg-monochrome-white bg-opacity-10)`,
  isActive && tw`bg-blue-default hover:bg-blue-default`,
]);
