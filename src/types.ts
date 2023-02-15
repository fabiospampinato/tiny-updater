
/* MAIN */

type Options = {
  name: string,
  version: string,
  ttl?: number
};

type StoreRecord = {
  timestampFetch: number,
  timestampNotification: number,
  version: string
};

/* EXPORT */

export type {Options, StoreRecord};
