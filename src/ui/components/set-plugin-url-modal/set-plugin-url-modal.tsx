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
import React, { useEffect, useState } from "react";
import {
  Button, Field, Fields, Form, FormGroup, Formik, Popup,
} from "@drill4j/ui-kit";
import "twin.macro";
import { usePluginUrls } from "hooks";

export const SetPluginUrlModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const plugins = usePluginUrls();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.keyCode === 72) { // ctrl + alt + h
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  if (!plugins) return null;
  return (
    <Popup isOpen={isOpen} onToggle={setIsOpen} header="Plugin urls" closeOnFadeClick>
      <div tw="w-147 px-4 py-6">
        <div tw="mb-6 text-16">
          After submitting the form, the page will be reloaded. The plugin urls will be cleared after closing the browser
        </div>
        <Formik
          initialValues={plugins}
          onSubmit={(value) => {
            sessionStorage.setItem("plugins-urls", JSON.stringify(value));
            document.location.reload();
          }}
        >
          {({ dirty }) => (
            <Form tw="space-y-6">
              {Object.keys(plugins).map((key) => (
                <FormGroup label={key} tw="w-full">
                  <Field name={key} component={Fields.Input} placeholder={`Enter ${key} url`} />
                </FormGroup>
              ))}
              <div tw="flex gap-x-4">
                <Button
                  primary
                  size="large"
                  type="submit"
                  disabled={!dirty}
                >
                  Save Changes
                </Button>
                <Button
                  primary
                  size="large"
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("plugins-urls");
                    document.location.reload();
                  }}
                >
                  Clear local data
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Popup>
  );
};
