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
  capitalize,
  Cells,
  Icons,
  Table,
  Tooltip,
  Stub,
  CopyButton,
  LinkButton,
  Button,
  ContentAlert,
} from "@drill4j/ui-kit";
import * as API from "../api";
import tw, { styled } from "twin.macro";
import { Role, UserData } from "../../models";

export const UserManagementTable = () => {
  const [users, setUsers] = useState([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const resetState = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await API.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [success, error]);

  if (!users.length) return <UsersStub />;

  const columns = [
    {
      Header: "Username",
      accessor: "username",
      filterable: true,
      textAlign: "left",
    },
    {
      Header: "Id",
      accessor: "id",
      width: "120px",
      textAlign: "left",
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }: any) => <>{value.toUpperCase()}</>,
      textAlign: "left",
    },
    {
      Header: "Blocked",
      accessor: "blocked",
      Cell: ({ value }: any) => (
        <>{value ? <div>blocked</div> : <div>-</div>}</>
      ),
      textAlign: "left",
    },
    {
      Header: "Actions",
      isCustomCell: true,
      Cell: ({ row: { values: userData } }: { row: { values: UserData } }) => (
        <div tw="flex gap-5">
          {!userData.blocked && (
            <>
              <Button
                secondary
                size="small"
                onClick={async () => {
                  try {
                    resetState();
                    const data = await API.blockUser(userData.id);
                    setSuccess(data);
                  } catch (error) {
                    setError(error.message);
                  }
                }}
              >
                Block
              </Button>

              <Button
                secondary
                size="small"
                onClick={async () => {
                  try {
                    resetState();
                    const response = await API.resetPassword(userData.id);
                    navigator.clipboard.writeText(response.data.password);
                    setSuccess(`${response.message} New password is copied to clipboard`);
                  } catch (error) {
                    setError(error.message);
                  }
                }}
              >
                Reset Password
              </Button>
            </>
          )}

          {userData.blocked && (
            <Button
              secondary
              size="small"
              onClick={async () => {
                try {
                  resetState();
                  const data = await API.unblockUser(userData.id);
                  setSuccess(data);
                } catch (error) {
                  setError(error.message);
                }
              }}
            >
              Unblock
            </Button>
          )}

          <Button
            secondary
            size="small"
            onClick={async () => {
              try {
                resetState();
                const data = await API.getUserById(userData.id);
                setSuccess(JSON.stringify(data.data));
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            Info
          </Button>
          
          <Button
            secondary
            disabled={userData.role != Role.UNDEFINED}
            size="small"
            onClick={async () => {
              try {
                resetState();
                // const data = await API.getUserById(userData.id);
                const data = (await new Promise((resolve, reject) =>
                  resolve("not implemented yet")
                )) as any;
                setSuccess(data);
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            Approve
          </Button>

        </div>
      ),
    },
  ];
  return (
    <> 
      <Table
        data={users}
        columns={columns}
        stub={
          <Stub
            icon={<Icons.Package height={104} width={107} />}
            title="No results found"
            message="Try adjusting your search or filter to find what you are looking for."
          />
        }
        defaultSortBy={[
          {
            id: "username",
            desc: false,
          },
        ]}
      />
      {error && <ContentAlert type="ERROR">{`${error}`}</ContentAlert>}
      {success && (
        <ContentAlert type="SUCCESS">{`${success}`}</ContentAlert>
      )}
    </>
  );
};

export const UsersStub = () => (
  <Stub
    icon={<Icons.Function height={104} width={107} />}
    title="No users"
    message=""
  />
);
