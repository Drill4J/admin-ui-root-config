import axios from "axios";
import { EditUserPayload } from "./models";
import { runCatching } from "../util";

async function getUsers() {
  const response = await runCatching(axios.get("/users"));
  return response.data.data;
}

async function editUser(
  id: number,
  editUserPayload: EditUserPayload
) {
  const response = await runCatching(axios.put(`/users/${id}`, editUserPayload));
  return response.data.message;
}

async function getUserById(id: number) {
  const response =  await runCatching(axios.get(`/users/${id}`));
  return response.data;
}

async function deleteUser(id: number) {
  const response =  await runCatching(axios.delete(`/users/${id}`));
  return response.data.message;
}

async function blockUser(id: number) {
  const response =  await runCatching(axios.patch(`/users/${id}/block`));
  return response.data.message;
}

async function unblockUser(id: number) {
  const response =  await runCatching(axios.patch(`/users/${id}/unblock`));
  return response.data.message;
}

async function resetPassword(id: number): Promise<PasswordResetResponse> {
  const response = await runCatching(axios.patch(`/users/${id}/reset-password`));
  return response.data;
}

type PasswordResetResponse = {
  data: {
    password: string
  };
  message: string;
}

export {
  getUsers,
  editUser,
  getUserById,
  deleteUser,
  blockUser,
  unblockUser,
  resetPassword,
};
