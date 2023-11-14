import axios from 'axios';
import { runCatching } from '../util';
import { LoginPayload, RegistrationPayload, ChangePasswordPayload } from './models';
import { TOKEN_KEY } from "common/constants";

async function signIn(loginPayload: LoginPayload): Promise<any> {
  const response = await runCatching(axios.post('/sign-in', loginPayload));
  localStorage.setItem(TOKEN_KEY, response.headers.authorization);
  return response.data.message;
}

async function signUp(registrationPayload: RegistrationPayload) {
  const response = await runCatching(axios.post('/sign-up', registrationPayload));
  return response.data.message
}

async function updatePassword(changePasswordPayload: ChangePasswordPayload) {
  const response = await runCatching(axios.post('/update-password', changePasswordPayload));
  return response.data.message
}

async function getUserInfo() {
  const response = await runCatching(axios.get('/user-info'));
  return response.data.data
}

export { signIn, signUp, updatePassword, getUserInfo };
