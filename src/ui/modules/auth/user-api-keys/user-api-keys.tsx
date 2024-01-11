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
import {UserApiKeysTable} from "./tables/keys";
import {useHistory} from "react-router-dom";
import {addQueryParamsToPath, Button} from "@drill4j/ui-kit";

export const UserApiKeys = () => {
  const {push} = useHistory();

  return (<div tw="p-5 pt-6">
      <div tw="text-32 leading-40 text-monochrome-black">
        API keys
      </div>
      <Button
        primary
        size="large"
        tw="w-min"
        onClick={() => {
          push(addQueryParamsToPath({activeModal: "generate-key"}));
        }}
      >
        Generate
      </Button>
      <div tw="mt-5">
        <UserApiKeysTable/>
      </div>
    </div>
  );
}

