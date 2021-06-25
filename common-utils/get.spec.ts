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
import { getPropertyByPath } from "./get-property-by-path";

describe("get", () => {
  const client = {
    foo: {
      bar: {
        buzz: "buzz",
      },
    },
  };
  it("should retrieve value by path from object", () => {
    expect(getPropertyByPath(client, "foo.bar.buzz")).toBe("buzz");
  });

  it("should return object if no path provided", () => {
    expect(getPropertyByPath(client, undefined)).toBe(client);
    expect(getPropertyByPath(client, "")).toBe(client);
  });

  it("should return undefined if value does not exist by provided path", () => {
    expect(getPropertyByPath(client, "foo.buzz")).toBe(undefined);
  });

  it("should return undefined if no object provided", () => {
    expect(getPropertyByPath(undefined, "foo.buzz")).toBe(undefined);
  });

  it("should return null if object is null", () => {
    expect(getPropertyByPath(null, "foo.buzz")).toBe(null);
  });
});
