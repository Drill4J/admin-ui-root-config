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
import { useLocation } from "react-router-dom";
import "twin.macro";
import { defaultAdminSocket } from "common/connection";

import {
  IAlert, sendAlertEvent, SystemAlert, Portal,
} from "@drill4j/ui-kit";

export const AlertManager = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [isLastMassageWasConnectionError, setIsLastMassageWasConnectionError] = useState(false);
  const { pathname = "" } = useLocation();
  function handleShowMessage(e: CustomEvent<IAlert>) {
    const alert = e.detail;
    const deleteAlert = () => {
      setAlerts((prevAlertsState) => prevAlertsState.filter(value => value.id !== alert.id));
    };
    if (alert.type === "SUCCESS") {
      const timerId = setTimeout(deleteAlert, 3000);
      alert.onClose = () => {
        clearTimeout(timerId);
        deleteAlert();
      };
    } else {
      alert.onClose = deleteAlert;
    }

    setAlerts((prevAlertsState) => [...prevAlertsState, alert]);
  }

  useEffect(() => {
    document.addEventListener("system-alert", handleShowMessage as EventListener);
    return () => document.removeEventListener("system-alert", handleShowMessage as EventListener);
  }, []);

  useEffect(() => {
    let timerId : NodeJS.Timeout;
    defaultAdminSocket.onCloseEvent = () => {
      if (isLastMassageWasConnectionError || timerId) return;
      timerId = setTimeout(() => {
        setIsLastMassageWasConnectionError(true);
        sendAlertEvent({
          type: "ERROR",
          title: "Backend connection has been lost. Trying to reconnect...",
        });
      }, 4000);
    };
    defaultAdminSocket.onOpenEvent = () => {
      clearTimeout(timerId);
      if (isLastMassageWasConnectionError) {
        sendAlertEvent({
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
        <AlertPanel alerts={getLatestAlerts(alerts)} />
      )}
    </>
  );
};

export const AlertPanel = ({ alerts }: { alerts: IAlert[] }) => (
  <Portal displayContent rootElementId="alerts">
    <div tw="fixed bottom-10 flex flex-col-reverse items-center justify-center gap-y-2 w-full z-[200]">
      {alerts.map(alert => {
        const {
          id, title, text, onClose = () => {}, type,
        } = alert;
        return <SystemAlert key={id} title={title} type={type} onClose={onClose}>{text}</SystemAlert>;
      })}
    </div>
  </Portal>
);

function getLatestAlerts(alerts: IAlert[]) {
  return alerts.length > 3 ? alerts.slice(alerts.length - 3) : alerts;
}