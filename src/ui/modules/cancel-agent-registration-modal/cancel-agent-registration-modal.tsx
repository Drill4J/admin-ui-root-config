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
import React from "react";
import { Button, Modal } from "@drill4j/ui-kit";
import { useHistory } from "react-router-dom";

import "twin.macro";

import { getPagePath } from "common";

interface Props {
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  header: React.ReactNode;
  message: React.ReactNode;
}

export const CancelAgentRegistrationModal = ({
  isOpen, onToggle, header, message,
}: Props) => {
  const { push } = useHistory();
  return (
    <>
      {isOpen && (
        <Modal>
          <Modal.Content closeOnFadeClick={false}>
            <Modal.Header>{header}</Modal.Header>
            <Modal.Body tw="w-108">
              <span tw="text-14">
                {message}
              </span>
            </Modal.Body>
            <Modal.Footer tw="flex mt-6 gap-4">
              <Button primary size="large" onClick={() => push(getPagePath({ name: "agentsTable" }))}>
                Abort
              </Button>
              <Button secondary size="large" onClick={() => onToggle(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};
