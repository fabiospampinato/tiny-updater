
/* MAIN */

type AuthInfo = {
  type: string,
  token: string
};

type Options = {
  authInfo?: AuthInfo | undefined
  name: string,
  registryUrl?: string | undefined,
  version: string,
  ttl?: number | undefined
};

type StoreRecord = {
  timestampFetch: number,
  timestampNotification: number,
  version: string
};

type UtilsFetchOptions = {
  authInfo?: AuthInfo | undefined
};

type UtilsGetLatestVersionOptions = {
  authInfo?: AuthInfo | undefined,
  registryUrl?: string | undefined
};

/* EXPORT */

export type {
  AuthInfo,
  Options,
  StoreRecord,
  UtilsFetchOptions,
  UtilsGetLatestVersionOptions
};
