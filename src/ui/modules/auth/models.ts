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
// eslint-disable-next-line
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  UNDEFINED = "UNDEFINED",
}

export type UserData = {
  blocked: boolean;
  id: number;
  role: Role;
  username: string;
}

export type KeyData = {
  id: number;
  userId: number;
  description: string;
  expiresAt: string;
  createdAt: string;
  username: string;
  role: Role;
}

export type UserKeyData = {
  id: number;
  description: string;
  expiresAt: string;
  createdAt: string;
}