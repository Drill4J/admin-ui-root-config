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
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Button, Checkbox, Field, Formik, Modal, useCloseModal,
} from "@drill4j/ui-kit";

import "twin.macro";

interface Props {
  submit: (analityc: boolean) => void,
  status: boolean,
}

export const AnalitycModal = ({ submit, status }: Props) => {
  const { search } = useLocation();
  const closeModal = useCloseModal("analityc");

  return (
    <Modal isOpen={false} onClose={closeModal}>
      {({ setIsOpen }) => {
        useEffect(() => {
          search && setIsOpen(search.includes("activeModal=analityc"));
        }, [search]);

        return (
          <Modal.Content type="info" tw="w-[480px] text-14 leading-20">
            <Formik
              initialValues={{
                analityc: status,
              }}
              onSubmit={({ analityc }) => {
                submit(analityc);
                closeModal();
              }}
            >
              {({ submitForm }) => (
                <>
                  <Modal.Header>
                    Analytics
                  </Modal.Header>
                  <Modal.Body tw="flex flex-col gap-6 pb-2">
                    <p tw="font-bold">You can help us to improve Drill4J.</p>
                    <p>
                      While you are using the app, we will gather analytics that might
                      help us improve performance and usability by tracking the usage
                      frequency of particular features. Usage analytics may include:
                    </p>
                    <ul tw="list-disc pl-5">
                      <li>Device information — such as your hardware model, OS, screen resolution, browser version.</li>
                      <li>Behavior information — such as details of how you use Drill4J;
                        where you click and what actions you do; how long you leave the app open etc.
                      </li>
                    </ul>
                    <label tw="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        name="analityc"
                      >
                        {({ field }: any) => (
                          <Checkbox field={field} tw="text-blue-default" />
                        )}
                      </Field>
                      Help us improve Drill4J by automatically sending analytics
                    </label>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      primary
                      size="large"
                      type="submit"
                      onClick={submitForm}
                    >
                      Submit
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Formik>
          </Modal.Content>
        );
      }}
    </Modal>
  );
};
