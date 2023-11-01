import axios from 'axios';
import { runCatching } from '../util';
import { LoginPayload, RegistrationPayload, ChangePasswordPayload } from './models';

async function signIn(loginPayload: LoginPayload): Promise<string> {
  const response = await runCatching(axios.post('/sign-in', loginPayload));
  return response.headers.authorization;
}

async function signUp(registrationPayload: RegistrationPayload) {
  return await runCatching(axios.post('/sign-up', registrationPayload));
}

async function updatePassword(changePasswordPayload: ChangePasswordPayload) {
  return await await runCatching(axios.post('/update-password', changePasswordPayload));
}

export { signIn, signUp, updatePassword };
