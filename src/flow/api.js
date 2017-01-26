/* eslint-disable no-unused-vars */

/**
 * @name ApiResp
 */
declare class ApiResp {
  bodyUsed: boolean;
  headers: Object;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: 'basic' | 'cors' | 'error' | 'opaque';
  url: string;

  data: Object;
  error: ?string;
  errorDescription: ?string;

  clone(): Response;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<Object>;
  text(): Promise<string>;
}

type Response = Object;