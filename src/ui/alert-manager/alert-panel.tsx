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
import { IAlert, SystemAlert } from "@drill4j/ui-kit";

interface Props {
  alerts: IAlert[];
}

export const AlertPanel = ({ alerts }: Props) => (
  <div tw="absolute h-fit w-min left-0 right-0 bottom-10 m-auto flex flex-col-reverse items-center gap-y-2 z-[200]">
    {alerts.map(alert => {
      const {
        id, title, text, onClose = () => {}, type,
      } = alert;
      return <SystemAlert key={id} title={title} type={type} onClose={onClose}>{text}</SystemAlert>;
    })}
  </div>
);
