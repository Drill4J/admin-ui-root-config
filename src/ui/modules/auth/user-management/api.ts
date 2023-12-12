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
import { EditUserPayload } from "./models";
import { runCatching } from "../util";

async function getUsers() {
  const response = await runCatching<any>(axios.get("/users"));
  return response.data.data;
}

async function editUser(
  id: number,
  editUserPayload: EditUserPayload,
) {
  const response = await runCatching<any>(axios.put(`/users/${id}`, editUserPayload));
  return response.data.message;
}

async function getUserById(id: number) {
  const response = await runCatching<any>(axios.get(`/users/${id}`));
  return response.data;
}

async function deleteUser(id: number) {
  const response = await runCatching<any>(axios.delete(`/users/${id}`));
  return response.data.message;
}

async function blockUser(id: number) {
  const response = await runCatching<any>(axios.patch(`/users/${id}/block`));
  return response.data.message;
}

async function unblockUser(id: number) {
  const response = await runCatching<any>(axios.patch(`/users/${id}/unblock`));
  return response.data.message;
}

async function resetPassword(id: number): Promise<PasswordResetResponse> {
  const response = await runCatching<any>(axios.patch(`/users/${id}/reset-password`));
  return response.data;
}

type PasswordResetResponse = {
  data: {
    password: string
  };
  message: string;
}

export {
  getUsers,
  editUser,
  getUserById,
  deleteUser,
  blockUser,
  unblockUser,
  resetPassword,
};
