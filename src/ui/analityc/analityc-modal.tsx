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
import { Formik, Modal, useCloseModal } from "@drill4j/ui-kit";

import "twin.macro";

export const AnalitycModal = () => {
  const { search } = useLocation();
  const closeModal = useCloseModal("analityc");

  return (
    <Modal isOpen={false} onClose={closeModal}>
      {({ setIsOpen }) => {
        useEffect(() => {
          search && setIsOpen(search.includes("activeModal=analityc"));
        }, [search]);

        return (
          <Modal.Content type="info">
            <Formik
              initialValues={{}}
              onSubmit={() => {}}
            >
              <>
                <Modal.Header>
                  Analytics
                </Modal.Header>
                <Modal.Body tw="pb-2">
                  You can help us to improve Drill4J.
                  While you are using the app, we will gather analytics that might
                  help us improve performance and usability by tracking the usage
                  frequency of particular features. Usage analytics may include:
                  Device information — such as your hardware model, OS, screen resolution, browser version.
                  Behavior information — such as details of how you use Drill4J;
                  where you click and what actions you do; how long you leave the app open etc.
                </Modal.Body>
              </>
            </Formik>
          </Modal.Content>
        );
      }}
    </Modal>
  );
};
