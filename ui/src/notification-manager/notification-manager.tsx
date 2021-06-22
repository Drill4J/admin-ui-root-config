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
import React, {
  ReactNode, useState, createContext, useEffect,
} from "react";
import { MessagePanel } from "@drill4j/ui-kit";

import { Message } from "types/message";
import { defaultAdminSocket } from "common/connection";
import { useLocation } from "react-router-dom";

interface Props {
  className?: string;
  children?: ReactNode;
}

type ContextType = {
  showMessage: (message: Message) => void;
  closeMessage: () => void;
  currentMessage: Message | null;
};

export const NotificationManagerContext = createContext<ContextType>({
  showMessage: () => {},
  closeMessage: () => {},
  currentMessage: null,
});

const sendNotificationEvent = (message: Message) => {
  const event = new CustomEvent<Message>("notification", {
    detail: {
      text: message.text,
      type: message.type,
    },
  });
  document.dispatchEvent(event);
};

export const NotificationManager = ({ children }: Props) => {
  const [message, setMessage] = useState<Message | null>(null);
  const { pathname = "" } = useLocation();

  function handleShowMessage(e: CustomEvent<Message>) {
    if (e.detail.type === "SUCCESS") {
      setMessage(e.detail);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }

    setMessage(e.detail);
  }

  useEffect(() => {
    document.addEventListener("notification", handleShowMessage as EventListener);
    return () => document.removeEventListener("notification", handleShowMessage as EventListener);
  }, []);

  defaultAdminSocket.onCloseEvent = () => {
    setMessage({
      type: "ERROR",
      text: "Backend connection has been lost. Trying to reconnect...",
    });
  };
  defaultAdminSocket.onOpenEvent = () =>
    sendNotificationEvent({
      type: "SUCCESS",
      text: "Backend connection has been successfully restored.",
    });

  return (
    <>
      {message && pathname !== "/login" && (
        <MessagePanel message={message} onClose={() => setMessage(null)} />
      )}
      {children}
    </>
  );
};
