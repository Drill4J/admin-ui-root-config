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
  Icons,
  Table,
  Stub,
  Button,
  sendAlertEvent
} from "@drill4j/ui-kit";
import * as API from "../api";
import tw, { styled } from "twin.macro";
import { Role, UserData } from "../../models";

export const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [refreshFlag, refreshData] = useState<string>("");

  const setSuccess =  (data: string) => {
    refreshData(Date.now().toString());
    sendAlertEvent({ type: "SUCCESS", title: data  });
  };
  
  const setError = (data: string) => {
    refreshData(Date.now().toString());
    sendAlertEvent({ type: "ERROR", title: data  });
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
  }, [refreshFlag]);

  if (!users.length) return <UsersStub />;

  const columns = [
    {
      Header: "Id",
      accessor: "id",
      width: "10%",
      textAlign: "left",
    },
    {
      Header: "Username",
      accessor: "username",
      filterable: true,
      width: "30%",
      Cell: ({ value }: any) => <div>{value}</div>,
      textAlign: "left",
    },
    {
      Header: "Role",
      accessor: "role",
      width: "20%",
      filterable: true,
      Cell: ({ value }: any) => <>{value.toUpperCase()}</>,
      textAlign: "left",
    },
    {
      Header: "Blocked",
      accessor: "blocked",
      width: "10%",
      Cell: ({ value }: any) => (
        <>{value ? <div>blocked</div> : <div>-</div>}</>
      ),
      textAlign: "left",
    },
    {
      Header: "Actions",
      textAlign: "left",
      width: "30%",
      notSortable: true,
      isCustomCell: true,
      Cell: renderUserManagementActions(setSuccess, setError),
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

function renderUserManagementActions(
  setSuccess: (data: string) => void,
  setError: (data: string) => void
) {
  return ({ row: { values: userData } }: { row: { values: UserData } }) => {
    if (userData.role === Role.UNDEFINED) {
      return (
        <div tw="flex flex-wrap gap-5">
          <Button
            primary
            size="small"
            onClick={async () => {
              try {
                const isConfirmed = window.confirm(`Are you sure you want to approve user "${userData.username}" registration?`);
                if (!isConfirmed) return
                const data = await API.editUser(userData.id, {
                  role: Role.USER,
                });
                setSuccess(data);
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            Approve registration
          </Button>
        </div>
      );
    }

    if (userData.blocked === true) {
      return (
        <div tw="flex flex-wrap gap-5">
          <Button
            secondary
            size="small"
            onClick={async () => {
              try {
                const isConfirmed = window.confirm(`Are you sure you want to unblock the user "${userData.username}"?`);
                if (!isConfirmed) return
                const data = await API.unblockUser(userData.id);
                setSuccess(data);
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            Unblock
          </Button>
        </div>
      );
    }

    return (
      <div tw="flex flex-wrap gap-5">
        <Button
          secondary
          size="small"
          onClick={async () => {
            try {
              const isConfirmed = window.confirm(`Are you sure you want to block the user "${userData.username}"?`);
              if (!isConfirmed) return
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
            const isConfirmed = window.confirm(`Are you sure you want to reset the password for user "${userData.username}"?`);
            if (!isConfirmed) return
            try {
              const response = await API.resetPassword(userData.id);
              navigator.clipboard.writeText(response.data.password);
              setSuccess(
                `${response.message} New password is copied to clipboard`
              );
            } catch (error) {
              setError(error.message);
            }
          }}
        >
          Reset Password
        </Button>
        <Button
            primary
            size="small"
            onClick={async () => {
              try {
                const targetRole = userData.role === Role.USER ? Role.ADMIN : Role.USER;
                const isConfirmed = window.confirm(`Are you sure you want to change role for user "${userData.username}" to ${targetRole}?`);
                if (!isConfirmed) return
                const data = await API.editUser(userData.id, {
                  role: targetRole,
                });
                setSuccess(data);
              } catch (error) {
                setError(error.message);
              }
            }}
          >
           Make { userData.role === Role.USER ? Role.ADMIN : Role.USER }
          </Button>
      </div>
    );
  };
}
