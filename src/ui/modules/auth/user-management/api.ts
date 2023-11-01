import axios from "axios";
import { EditUserPayload } from "./models";
import { runCatching } from "../util";

async function getUsers() {
  return await runCatching(axios.get("/users"));
}
async function editUser(
  id: number,
  editUserPayload: EditUserPayload
) {
  return await runCatching(axios.put(`/users/${id}`, editUserPayload));
}

async function getUserById(id: number) {
  return await runCatching(axios.get(`/users/${id}`));
}

async function deleteUser(id: number) {
  return await runCatching(axios.delete(`/users/${id}`));
}

async function blockUser(id: number) {
  return await runCatching(axios.patch(`/users/${id}/block`));
}

async function unblockUser(id: number) {
  return await runCatching(axios.patch(`/users/${id}/unblock`));
}

async function resetPassword(id: number) {
  return await runCatching(axios.patch(`/users/${id}/resetpassword`));
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
