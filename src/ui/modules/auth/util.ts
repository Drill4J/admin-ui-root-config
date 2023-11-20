import { AxiosResponse } from "axios";
import { ApiResponseData } from "./hooks/types";

export async function runCatching<ReturnType>(promise: Promise<AxiosResponse<ApiResponseData<ReturnType>>>) {
  try {
    return await promise
  } catch (e) {
    const message = e?.response?.data?.message || e?.message || 'unknown error';
    throw new Error(message);
  }
}
