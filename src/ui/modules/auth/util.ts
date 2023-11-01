import { AxiosResponse } from "axios";

export async function runCatching(promise: Promise<AxiosResponse<any>>) {
  try {
    return await promise
  } catch (e) {
    const message = e?.response?.data?.message || e?.message || 'unknown error';
    throw new Error(message);
  }
}
