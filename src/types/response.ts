export type BaseResponse<T> = {
  data: T
  message: string
  status: string
  pagination?: Pagination
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}