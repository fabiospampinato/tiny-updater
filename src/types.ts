
/* MAIN */

type Options = {
  name: string,
  version: string,
  registry?: Registry,
  ttl?: number
};

type Package = {
  version: string
};

type Registry = {
  headers?: Record<string, string>,
  url?: string
};

type StoreRecord = {
  timestamp: number,
  version: string
};

/* EXPORT */

export type {Options, Package, Registry, StoreRecord};
