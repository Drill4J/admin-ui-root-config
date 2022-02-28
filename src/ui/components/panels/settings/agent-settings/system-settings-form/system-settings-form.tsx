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
import React, { useState } from "react";
import {
  DarkFormGroup, dotsAndSlashesToSlash, Field, Fields, Icons,
} from "@drill4j/ui-kit";

import "twin.macro";

export const SystemSettingsForm = () => {
  const [unlockedPackages, setUnlockedPackages] = useState(false);

  return (
    <>
      {unlockedPackages && (
        <div tw="flex w-[400px] gap-x-4 p-6 border border-orange-default rounded-lg text-orange-default text-14 leading-24">
          <div tw="pt-1">
            <Icons.Danger />
          </div>
          Please be aware that any change to the package
          list will result in a complete loss of gathered data
          in plugins that have been using these packages.
        </div>
      )}
      <DarkFormGroup label={(
        <div tw="flex justify-between w-[400px]">
          Application Packages
          {!unlockedPackages && (
            <div onClick={() => setUnlockedPackages(true)} tw="flex items-center gap-x-2 font-regular cursor-pointer">
              <Icons.Lock width={12} height={14} />
              Unlock
            </div>
          )}
        </div>
      )}
      >
        <Field
          component={Fields.DarkTextarea}
          name="systemSettings.packages"
          placeholder="e.g., package_name/class_name/method_name"
          disabled={!unlockedPackages}
          normalize={(str: string) => dotsAndSlashesToSlash(str).replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
        />
      </DarkFormGroup>
      <DarkFormGroup label="Header Mapping" optional>
        <Field
          name="systemSettings.sessionIdHeaderName"
          component={Fields.DarkInput}
          placeholder="Enter session header name"
        />
      </DarkFormGroup>
    </>
  );
};
