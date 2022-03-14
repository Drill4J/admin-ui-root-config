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

interface Props {
  stepNumber: number;
  stepLabel: string;
  isActive: boolean;
  isCompleted: boolean;
  isValid?: boolean;
}

export const StepLabel = ({
  stepNumber, stepLabel, isActive, isCompleted, isValid = true,
}: Props) => (
  <Label isActive={isActive} isCompleted={isCompleted} isDisable={!isValid} className="group">
    {isActive
      ? <ActveCircle>{stepNumber}</ActveCircle>
      : <DefaultCircle isCompleted={isCompleted}>{stepNumber}</DefaultCircle>}
    {stepLabel}
  </Label>
);

const Circle = styled.div`
  ${tw` flex items-center justify-center min-width[24px] h-6 rounded-full`}
`;

const ActveCircle = styled(Circle)`
  ${tw`bg-blue-default border-0 text-monochrome-white`}
`;

const DefaultCircle = styled(Circle)`
  ${tw`border border-monochrome-shade bg-transparent text-monochrome-shade group-hover:(border-blue-default text-blue-default)`}
  ${({ isCompleted }: { isCompleted: boolean }) => [
    isCompleted && tw`border-blue-default text-blue-default`,
  ]
}
`;

const Label = styled.div`
  ${tw`flex gap-2 items-center text-14 leading-20 font-bold text-monochrome-shade hover:(text-blue-default cursor-pointer)`}
  ${({ isActive, isCompleted, isDisable }: { isActive: boolean, isCompleted: boolean, isDisable: boolean }) => [
    isActive && tw`text-monochrome-white font-bold`,
    isCompleted && tw`text-monochrome-light-tint`,
    isDisable && tw`pointer-events-none`,
  ]
}
`;
