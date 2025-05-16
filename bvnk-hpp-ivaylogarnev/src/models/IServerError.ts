export interface IServerError {
  readonly code: string;
  readonly message: string;
  readonly parameter: string;
  readonly requestId: string;
  readonly errorList: IServerError[];
}
