

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
import { UserManagementTable } from "./tables/users";

import {
  addQueryParamsToPath,
  ContentAlert,
  Form,
  Tooltip,
} from "@drill4j/ui-kit";
import tw, { styled } from "twin.macro";


export const UserManagement = () => {
  return (
    <div tw="p-5 pt-6">
      <div tw="text-32 leading-40 text-monochrome-black">
        User management
      </div>
      
      <div tw="mt-5">
        <UserManagementTable/>
      </div>
    </div>
  );
};