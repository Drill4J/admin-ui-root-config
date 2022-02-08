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

import "twin.macro";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onLeave: () => void;
}

export const UnSaveChangesModal = ({ isOpen, onToggle, onLeave }: Props) => (isOpen ? (
  <Modal onClose={onToggle} isOpen={isOpen}>
    <Modal.Content type="info" tw="w-108 !z-[200]">
      <Modal.Header>Unsaved Changes</Modal.Header>
      <Modal.Body>
        <div tw=" text-14 leading-20 text-monochrome-black">
          There are unsaved changes. If you would like to keep changes,<br /> press the “Continue Editing” button.
        </div>
      </Modal.Body>
      <div />
      <Modal.Footer tw="flex gap-x-4">
        <Button primary size="large" onClick={onToggle}>Continue Editing</Button>
        <Button secondary size="large" onClick={onLeave}>
          Leave Without Saving
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
) : null);
