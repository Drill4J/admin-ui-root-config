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
import { useEffect, useState } from "react";

export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const sessionStorageValue = sessionStorage.getItem(key);
      if (typeof sessionStorageValue !== "string") {
        sessionStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(sessionStorageValue || "null");
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem(key, serializedState);
    } catch (e) {
      console.log(e);
    }
  });

  return [state, setState];
};
