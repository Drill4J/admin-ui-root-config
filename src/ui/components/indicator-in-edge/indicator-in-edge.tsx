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

type Position = "top-right" | "bottom-right"

interface Props {
  children?: React.ReactNode;
  indicatorContent?: React.ReactNode;
  isHidden?: boolean;
  position?: Position;
  className?: string;
}

export const IndicatorInEdge = ({
  indicatorContent, isHidden, position, children, className,
}: Props) => (
  <div tw="relative inline-flex">
    {children}
    <Wrapper isHidden={isHidden} position={position} className={className}>
      {indicatorContent || <div tw="rounded-lg w-2 h-2 bg-green-medium-tint" />}
    </Wrapper>
  </div>
);
export const Wrapper = styled.span<Props>`
  ${tw`absolute`}
  ${({ isHidden }) => isHidden && tw`hidden`}
  ${({ position }) => position === "top-right" && tw`top-0 right-0 transform translate-x-1/2 -translate-y-1/2`}
  ${({ position }) => position === "bottom-right" && tw`bottom-0 right-0 transform translate-x-1/2 translate-y-1/2`}
`;
