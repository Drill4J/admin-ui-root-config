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
  useState, useEffect,
} from "react";
import { useLocation } from "react-router-dom";

import { Alert } from "types/alert";
import { defaultAdminSocket } from "common/connection";

import { sendNotificationEvent } from "../../../send-notification-event";
import { AlertPanel } from "./alert-panel";

export const AlertManager = () => {
  const [alerts, setAlerts] = useState<Set<Alert>>(new Set());
  const [isLastMassageWasConnectionError, setIsLastMassageWasConnectionError] = useState(false);
  const { pathname = "" } = useLocation();

  function handleShowMessage(e: CustomEvent<Alert>) {
    const alert = e.detail;
    const deleteAlert = () => {
      alerts.delete(alert);
      setAlerts(new Set(alerts));
    };
    if (e.detail.type === "SUCCESS") {
      const timerId = setTimeout(() => {
        deleteAlert();
      }, 3000);
      alert.onClose = () => {
        clearTimeout(timerId);
        deleteAlert();
      };
    } else {
      alert.onClose = () => {
        deleteAlert();
      };
    }

    setAlerts(new Set(alerts.add(alert)));
  }

  useEffect(() => {
    document.addEventListener("systemalert", handleShowMessage as EventListener);
    return () => document.removeEventListener("systemalert", handleShowMessage as EventListener);
  }, []);
  useEffect(() => {
    let timerId : NodeJS.Timeout;
    defaultAdminSocket.onCloseEvent = () => {
      if (isLastMassageWasConnectionError || timerId) return;
      timerId = setTimeout(() => {
        setIsLastMassageWasConnectionError(true);
        sendNotificationEvent({
          type: "ERROR",
          title: "Backend connection has been lost. Trying to reconnect...",
        });
      }, 4000);
    };
    defaultAdminSocket.onOpenEvent = () => {
      clearTimeout(timerId);
      if (isLastMassageWasConnectionError) {
        sendNotificationEvent({
          type: "SUCCESS",
          title: "Backend connection has been successfully restored.",
        });
        setIsLastMassageWasConnectionError(false);
      }
    };
  }, [isLastMassageWasConnectionError]);

  return (
    <>
      {pathname !== "/login" && (
        <AlertPanel alerts={alerts} />
      )}
    </>
  );
};
