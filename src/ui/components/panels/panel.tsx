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

export interface Props {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClosePanel: () => void;
  isDisabledFade?: boolean;
}

export const Panel = ({
  children, header, isOpen, onClosePanel, footer, isDisabledFade = false, ...rest
}: Props) => (isOpen
  ? (
    <div data-test="panel" tw="absolute inset-0 left-12 z-[120] grid w-auto h-auto grid-cols-[auto 1fr]">
      <div tw="h-full flex flex-col text-monochrome-light-tint text-24" {...rest}>
        <div tw="px-6 leading-32 bg-monochrome-black">{header}</div>
        {/* fixed height need that browser can apply scroll styles */}
        <div tw="relative px-6 bg-monochrome-black flex-grow bg-opacity-[0.97] overflow-y-auto custom-scroll h-4">
          {children}
        </div>
        {footer && <div tw="h-18 bg-monochrome-black">{footer}</div>}
      </div>
      <div onClick={!isDisabledFade ? onClosePanel : () => {}} style={{ background: "rgba(0, 0, 0, 0.4)" }} />
    </div>
  ) : null
);
