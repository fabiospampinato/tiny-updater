
/* MAIN */

type Options = {
  name: string,
  version: string,
  ttl?: number
};

type Package = {
  version: string
};

type StoreRecord = {
  timestamp: number,
  version: string
};

/* EXPORT */

export type {Options, Package, StoreRecord};
