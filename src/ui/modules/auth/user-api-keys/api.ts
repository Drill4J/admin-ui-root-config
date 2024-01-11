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
import axios from "axios";
import {runCatching} from "../util";
import {GenerateApiKeyPayload} from "./models";

async function getKeys() {
  const response = await runCatching<any>(axios.get("/user-keys"));
  return response.data.data;
}

async function deleteKey(id: number) {
  const response = await runCatching<any>(axios.delete(`/user-keys/${id}`));
  return response.data.message;
}

async function generateKey(payload: GenerateApiKeyPayload) {
  const response = await runCatching<any>(axios.post(`/user-keys`, payload));
  return response.data;
}

export {
  getKeys,
  deleteKey,
  generateKey
};