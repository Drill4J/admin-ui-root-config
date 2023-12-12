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
  Modal,
  useCloseModal,
  useQueryParams,
  ContentAlert,
} from "@drill4j/ui-kit";

import "twin.macro";
import { updatePasswordForm } from "../forms/update-password";

export const UpdatePasswordModal = () => {
  const queryParams = useQueryParams<{ activeModal: string }>();
  const closeModal = useCloseModal(["update-password"]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const resetState = () => {
    setError("");
    setSuccess("");
  };

  return (
    <Modal isOpen={false} onClose={closeModal}>
      {({ setIsOpen }) => {
        useEffect(() => {
          setIsOpen(queryParams.activeModal === "update-password");
        }, [queryParams]);
        return (
          <Modal.Content type="info" tw="text-14 leading-20">
            <Modal.Header>
              Update Password
            </Modal.Header>
            <Modal.Body tw="flex justify-center">
              {updatePasswordForm(setSuccess, setError, resetState)}
            </Modal.Body>
            <Modal.Footer>
              {error && <ContentAlert type="ERROR">{`${error}`}</ContentAlert>}
              {success && (
                <ContentAlert type="SUCCESS">{`${success}`}</ContentAlert>
              )}
            </Modal.Footer>
          </Modal.Content>
        );
      }}
    </Modal>
  );
};
