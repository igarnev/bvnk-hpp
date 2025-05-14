export interface ServerError {
  readonly code: string;
  readonly message: string;
  readonly parameter: string;
  readonly requestId: string;
}
