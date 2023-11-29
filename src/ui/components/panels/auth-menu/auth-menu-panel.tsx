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
import { AuthMenu } from "./auth-menu";

export interface Props {
  onClosePanel: () => void;
}

export const AuthMenuPanel = ({ onClosePanel }: Props) => (
  <div data-test="panel" tw="absolute inset-0 left-12 z-[120] grid w-auto h-auto grid-cols-[1fr]">
    <div onClick={onClosePanel} />
    <div tw="fixed z-[130] left-[55px] bottom-[5px]">
      <AuthMenu close={onClosePanel} />
    </div>
  </div>
);
