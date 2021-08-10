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

const containerPaths = {
  test2code: "http://localhost:8080/Drill4J-test-to-code.js",
  stateWatcher: "http://localhost:8090/Drill4J-state-watcher-ui.js",
};

export const useContainerPaths = () => {
  const [paths, setPaths] = useState<Record<string, string> | null>(null);

  const getContainerPaths = async () => {
    if (process.env.NODE_ENV === "production") {
      const response = await fetch("/container-paths.json");
      const data = await response.json();
      setPaths(data);
    } else {
      setPaths(containerPaths);
    }
  };

  useEffect(() => {
    getContainerPaths();
  }, []);

  return paths;
};
