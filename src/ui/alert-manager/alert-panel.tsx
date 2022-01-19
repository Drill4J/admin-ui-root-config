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
import { SystemAlert } from "@drill4j/ui-kit";
import { Alert } from "../types/alert";

interface Props {
  alerts: Set<Alert>;
}

export const AlertPanel = ({ alerts }: Props) => (
  <div tw="absolute h-full w-full flex flex-col items-center justify-end gap-y-2 pb-8 z-[100]">
    {Array.from(alerts).map(message => {
      const {
        title, type, text, onClose,
      } = message;
      return <SystemAlert title={title} type={type} onClose={onClose}>{text}</SystemAlert>;
    })}
  </div>
);
