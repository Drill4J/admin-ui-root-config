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

interface Props {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const PluginsLayout = ({
  header, children, sidebar,
}: Props) => (
  <div tw="flex flex-col w-full h-full overflow-hidden">
    <div tw="flex-shrink-0 w-full h-28 border-b border-monochrome-medium-tint">{header}</div>
    <div tw="flex flex-row w-full h-full overflow-auto">
      <div tw="max-w-80px h-full">{sidebar}</div>
      <div className="flex items-start flex-col w-full overflow-y-auto overflow-x-hidden">
        <div tw="flex flex-grow w-full mb-6">{children}</div>
      </div>
    </div>
  </div>
);
