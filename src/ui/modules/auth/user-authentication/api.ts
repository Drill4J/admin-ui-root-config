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
import { TOKEN_KEY } from "common/constants";
import { runCatching } from "../util";
import {
  LoginPayload, RegistrationPayload, ChangePasswordPayload, UserInfo, UiConfig,
} from "./models";

async function signIn(loginPayload: LoginPayload): Promise<any> {
  const response = await runCatching<any>(axios.post("/sign-in", loginPayload));
  localStorage.setItem(TOKEN_KEY, response.headers.authorization);
  return response.data.message;
}

async function signUp(registrationPayload: RegistrationPayload) {
  const response = await runCatching<any>(axios.post("/sign-up", registrationPayload));
  return response.data.message;
}

async function signOut() {
  const response = await runCatching<any>(axios.post("/sign-out"));
  return response.data.message;
}

async function updatePassword(changePasswordPayload: ChangePasswordPayload) {
  const response = await runCatching<any>(axios.post("/update-password", changePasswordPayload));
  return response.data.message;
}

async function getUserInfo() {
  const response = await runCatching<UserInfo>(axios.get("/user-info"));
  return response.data.data;
}

async function getUiConfig() {
  const response = await runCatching<UiConfig>(axios.get("/ui-config"));
  return response.data.data?.auth;
}

export {
  signIn, signUp, signOut, updatePassword, getUserInfo, getUiConfig,
};
