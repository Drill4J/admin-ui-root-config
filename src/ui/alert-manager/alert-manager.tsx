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
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "twin.macro";
import { defaultAdminSocket } from "common/connection";

import {
  IAlert, SystemAlert, Portal,
} from "@drill4j/ui-kit";

const LOST_CONNECTION_ID = "LOST_CONNECTION_WITH_BACKEND";
const RESTORED_CONNECTION_ID = "SUCCESSFULLY_RESTORED_CONNECTION";

export const AlertManager = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const { pathname = "" } = useLocation();
  const hasConnectionAlert = alerts.some(({ id }) => id === LOST_CONNECTION_ID || id === RESTORED_CONNECTION_ID);

  const deleteAlert = useCallback((id) => {
    setAlerts((prevAlertsState) => prevAlertsState.filter(value => value.id !== id));
  }, []);

  const deleteLostConnectionAlert = useCallback(() => {
    setAlerts((currAlerts) => currAlerts.filter(({ id }) => id !== LOST_CONNECTION_ID));
  }, []);

  const deleteRestoredConnectionAlert = useCallback(() => {
    setAlerts((currAlerts) => currAlerts.filter(({ id }) => id !== RESTORED_CONNECTION_ID));
  }, []);

  const handleShowMessage = useCallback((e: CustomEvent<IAlert>) => {
    const alert = e.detail;
    if (alert.type === "SUCCESS") {
      const timerId = setTimeout(() => deleteAlert(alert.id), 3000);
      alert.onClose = () => {
        clearTimeout(timerId);
        deleteAlert(alert.id);
      };
    } else {
      alert.onClose = () => deleteAlert(alert.id);
    }

    setAlerts((prevAlertsState) => [...prevAlertsState, alert]);
  }, []);

  useEffect(() => {
    document.addEventListener("system-alert", handleShowMessage as EventListener);
    return () => document.removeEventListener("system-alert", handleShowMessage as EventListener);
  }, []);

  useEffect(() => {
    defaultAdminSocket.onCloseEvent = () => {
      if (hasConnectionAlert) return;
      setAlerts((prevAlertsState) => [...prevAlertsState, {
        id: LOST_CONNECTION_ID,
        type: "ERROR",
        title: "Backend connection has been lost. Trying to reconnect...",
        onClose: deleteLostConnectionAlert,
      }]);
    };

    defaultAdminSocket.onOpenEvent = () => {
      if (hasConnectionAlert) {
        const displaySuccessAlertTimerId = setTimeout(deleteRestoredConnectionAlert, 3000);

        setAlerts((currAlerts) => {
          const alertsWithoutConnectionError = currAlerts.filter(({ id }) => id !== LOST_CONNECTION_ID);
          return [...alertsWithoutConnectionError, {
            id: "SUCCESSFULLY_RESTORED_CONNECTION",
            type: "SUCCESS",
            title: "Backend connection has been successfully restored.",
            onClose: () => {
              clearTimeout(displaySuccessAlertTimerId);
              deleteRestoredConnectionAlert();
            },
          }];
        });
      }
    };
  }, [defaultAdminSocket, hasConnectionAlert]);

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

function getLatestAlerts(alerts: IAlert[]): IAlert[] {
  return alerts.length > 3 ? alerts.slice(alerts.length - 3) : alerts;
}
