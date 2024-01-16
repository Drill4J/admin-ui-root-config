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

import {DrillSocket} from "./drill-socket";

export const getSocketUrl = (socket: string) => {
  return `${window.location.href.startsWith('https') ? 'wss' : 'ws'}://${
    process.env.REACT_APP_API_HOST || window.location.host
  }/ws/${socket}`;
};

export const createApi = (apiPath: string, handleUnauthorized?: () => void) =>
  new DrillSocket(getSocketUrl(apiPath), handleUnauthorized);
