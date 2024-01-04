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
export const getRoutePath = (path: string) => `${getCustomPath()}${path}`;

export const getCustomPath = () => {
  const path = window.location.pathname;
  if (path === "/") {
    return "";
  }
  // All this strings is first part of all admin routes
  if (path.includes("agents")) {
    return removeSlashFromTheEnd(removeMultipleSlashes(path.split("agents")[0]));
  }
  if (path.includes("groups")) {
    return removeSlashFromTheEnd(removeMultipleSlashes(path.split("groups")[0]));
  }
  if (path.includes("login")) {
    return removeSlashFromTheEnd(removeMultipleSlashes(path.split("login")[0]));
  }
  if (path.includes("administrate")) {
    return removeSlashFromTheEnd(removeMultipleSlashes(path.split("administrate")[0]));
  }
  if (path.includes("keys")) {
    return removeSlashFromTheEnd(removeMultipleSlashes(path.split("keys")[0]));
  }

  return removeSlashFromTheEnd(removeMultipleSlashes(path));
};

const removeSlashFromTheEnd = (path: string): string => (path.slice(-1) === "/" ? path.slice(0, -1) : path);
const removeMultipleSlashes = (path: string): string => path.replace(/([^:])(\/\/+)/g, "$1/");
