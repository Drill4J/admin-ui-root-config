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
import React, {useEffect, useState} from "react";
import "twin.macro";
import {
  Icons,
  Table,
  Stub,
  Button,
  sendAlertEvent,
} from "@drill4j/ui-kit";
import * as API from "../api";
import {KeyData} from "../../models";
import {formatHumanReadableDate} from "../../util";

export const ApiKeysManagementTable = () => {
  const [keys, setKeys] = useState([]);
  const [refreshFlag, refreshData] = useState<string>("");

  const setSuccess = (data: string) => {
    refreshData(Date.now().toString());
    sendAlertEvent({type: "SUCCESS", title: data});
  };

  const setError = (data: string) => {
    refreshData(Date.now().toString());
    sendAlertEvent({type: "ERROR", title: data});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await API.getKeys();
        setKeys(data);
      } catch (error) {
        sendAlertEvent({
          type: "ERROR",
          title: "Failed to fetch keys list. Make sure Drill4J Admin API service is running and available.",
        });
        // eslint-disable-next-line
        console.error("Failed to fetch keys list:", error);
      }
    };

    fetchData();
  }, [refreshFlag]);

  if (!keys.length) return <KeysStub/>;

  const columns = [
    {
      Header: "Id",
      accessor: "id",
      width: "10%",
      textAlign: "left",
    },
    {
      Header: "User-Id",
      accessor: "userId",
      width: "10%",
      textAlign: "left",
    },
    {
      Header: "Description",
      accessor: "description",
      filterable: true,
      width: "30%",
      Cell: ({value}: any) => <div>{value}</div>,
      textAlign: "left",
    },
    {
      Header: "Expires At",
      accessor: "expiresAt",
      width: "30%",
      Cell: ({value}: any) => <div>{formatHumanReadableDate(value)}</div>,
      textAlign: "left",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      width: "30%",
      Cell: ({value}: any) => <div>{formatHumanReadableDate(value)}</div>,
      textAlign: "left",
    },
    {
      Header: "Username",
      accessor: "username",
      filterable: true,
      width: "30%",
      Cell: ({value}: any) => <div>{value}</div>,
      textAlign: "left",
    },
    {
      Header: "Role",
      accessor: "role",
      width: "30%",
      Cell: ({value}: any) => <div>{value}</div>,
      textAlign: "left",
    },
    {
      Header: "Actions",
      textAlign: "left",
      width: "30%",
      notSortable: true,
      isCustomCell: true,
      Cell: renderApiKeysManagementActions(setSuccess, setError),
    },
  ];
  return (
    <>
      <Table
        data={keys}
        columns={columns}
        stub={(
          <Stub
            icon={<Icons.Package height={104} width={107}/>}
            title="No results found"
            message="Try adjusting your search or filter to find what you are looking for."
          />
        )}
        defaultSortBy={[
          {
            id: "username",
            desc: false,
          },
        ]}
      />
    </>
  );
};

export const KeysStub = () => (
  <Stub
    icon={<Icons.Function height={104} width={107}/>}
    title="No keys"
    message=""
  />
);

function renderApiKeysManagementActions(
  setSuccess: (data: string) => void,
  setError: (data: string) => void,
) {
  return ({row: {values: keyData}}: { row: { values: KeyData } }) => {
    return (<div tw="flex flex-wrap gap-5">
      <Button
        secondary
        size="small"
        onClick={async () => {
          try {
            // eslint-disable-next-line
            const isConfirmed = window.confirm(`Are you sure you want to delete the key with id "${keyData.id}"?`);
            if (!isConfirmed) return;
            const data = await API.deleteKey(keyData.id);
            setSuccess(data);
          } catch (error) {
            setError(error.message);
          }
        }}
      >
        Delete
      </Button>
    </div>);
  };
}
