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
import { Icons } from "@drill4j/ui-kit";

import { Props, Panel } from "./panel";

export const PanelWithCloseIcon = ({
  isOpen, onClosePanel, isDisabledFade, ...rest
}: Props) => (isOpen ? (
  <>
    <div tw="absolute left-0 top-0 h-full w-12 bg-monochrome-black text-monochrome-white pt-8 px-4">
      <Icons.Close onClick={onClosePanel} tw="action-icon" />
    </div>
    <Panel isOpen={isOpen} onClosePanel={onClosePanel} isDisabledFade={isDisabledFade} {...rest} />
  </>
) : null);
