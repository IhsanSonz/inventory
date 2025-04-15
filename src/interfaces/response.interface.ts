export interface Response<T> {
  statusCode: number;
  message: string | null;
  data: T;
}
