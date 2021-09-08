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
import { sendNotificationEvent } from "@drill4j/send-notification-event";

const devModePaths = {
  test2code: "http://localhost:8080/Drill4J-test-to-code.js",
  stateWatcher: "http://localhost:8090/Drill4J-state-watcher-ui.js",
};

const errorHandler = async (func: () => any, message: string): Promise<any> => {
  try {
    return await func();
  } catch (e) {
    console.error(e);
    throw new Error(message);
  }
};

function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
const validate = (obj: Record<string, string>): boolean => Object.entries(obj)
  .every(([key, value]) => typeof key === "string" && isValidHttpUrl(value));
export const usePluginUrls = () => {
  const [paths, setPaths] = useState<Record<string, string> | null>(null);

  const getPluginUrls = async () => {
    if (process.env.NODE_ENV === "production") {
      try {
        const response = await errorHandler(async () => {
          const res = await fetch("/plugin-urls.json");
          if (res.status === 200) {
            return res;
          }
          throw new Error();
        },
        "CRITICAL ERROR: Failed to fetch JSON with plugin resources URLs");
        const data = await errorHandler(() => response.json(),
          "CRITICAL ERROR: JSON with plugin resources URLs is invalid. Check PLUGINS env variable value");
        errorHandler(() => {
          if (!validate(data)) {
            throw new Error();
          }
          setPaths(data);
        },
        "CRITICAL ERROR: plugin URL is invalid. Check PLUGINS env variable value");
      } catch (e) {
        sendNotificationEvent({ type: "ERROR", text: e.message });
      }
    } else {
      setPaths(devModePaths);
    }
    const localUrls = sessionStorage.getItem("plugins-urls");
    if (localUrls) {
      setPaths(JSON.parse(localUrls));
    }
  };

  useEffect(() => {
    getPluginUrls();
  }, []);

  return paths;
};
