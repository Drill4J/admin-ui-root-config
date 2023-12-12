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

import { useState, useEffect } from "react";
import { ApiResponse } from "./types";

// utility to extract return type of async function that is executing API request (specifically, it can be any async function)
// "never" implies that this utility is only applicable for async requests
type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

export const useApiData = <T extends () => Promise<any>>(request: T): ApiResponse<UnwrapPromise<ReturnType<T>>> => {
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<UnwrapPromise<ReturnType<T>> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await request();
        setData(result);
      } catch (error) {
        setIsError(true);
        switch (error?.response?.status) {
          case 401:
            setErrorMessage("Unauthorized - you are not logged in");
            break;
          case 403:
            setErrorMessage("Forbidden - you don't have necessary permissions");
            break;
          default:
            setErrorMessage(error?.response?.data?.message || "Unexpected server error occurred");
        }
      }
    };
    fetchData();
  }, []);

  return { data, isError, errorMessage };
};
