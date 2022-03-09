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
  ContentAlert, DarkFormGroup, dotsAndSlashesToSlash, Field, Fields, Icons, Tooltip,
} from "@drill4j/ui-kit";

import "twin.macro";

export const SystemSettingsForm = () => {
  const [unlockedPackages, setUnlockedPackages] = useState(false);

  return (
    <div tw="w-[400px] flex flex-col gap-y-6">
      {unlockedPackages && (
        <ContentAlert type="WARNING">
          Please be aware that any change to the package
          list will result in a complete loss of gathered
          data in plugins that have been using these packages.
        </ContentAlert>
      )}
      <DarkFormGroup label={(
        <div tw="flex justify-between w-[400px]">
          <div tw="flex gap-x-2 items-center">
            Application Packages
            <Tooltip
              message={(
                <div tw="space-y-2 text-[13px] leading-20">
                  <div>
                    Specify all necessary parts of your application.{"\n"}
                    Make sure you add application packages only,{"\n"}
                    otherwise Agent&apos;s performance will be affected.
                  </div>
                  <div>
                    Please, use:{"\n"}- new line as a separator;{"\n"}-
                    &quot;!&quot; before package/class for excluding;{"\n"}-
                    &quot;/&quot; in a package path.
                  </div>
                </div>
              )}
            >
              <Icons.Info />
            </Tooltip>
          </div>
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
          placeholder="e.g. com/example/mypackage&#10;foo/bar/baz&#10;and so on."
          disabled={!unlockedPackages}
          normalize={(str: string) => dotsAndSlashesToSlash(str).replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "")}
        />
      </DarkFormGroup>
      <DarkFormGroup
        optional
        label={(
          <div tw="flex gap-x-2 items-center h-4">
            Header Mapping
            <Tooltip
              message={(
                <div tw="space-y-2 text-[13px] leading-20">
                  Session header name to track User actions on your target app.
                </div>
              )}
            >
              <Icons.Info />
            </Tooltip>
          </div>
        )}
      >
        <Field
          name="systemSettings.sessionIdHeaderName"
          component={Fields.DarkInput}
          placeholder="Enter session header name"
        />
      </DarkFormGroup>
    </div>
  );
};
