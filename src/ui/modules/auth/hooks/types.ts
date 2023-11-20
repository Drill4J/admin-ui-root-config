export type ApiResponse<T> = {
  data: T | null
  isError: boolean
  errorMessage: string | null
}

export type ApiResponseData<T> = {
  data: T | null
  message: string
}
