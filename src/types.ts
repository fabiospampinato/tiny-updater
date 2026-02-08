
/* MAIN */

type Options = {
  name: string,
  version: string,
  print?: ( result: Result ) => void,
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

type Result = {
  name: string,
  current: string,
  latest: string
};

type StoreRecord = {
  timestamp: number,
  version: string
};

/* EXPORT */

export type {Options, Package, Registry, Result, StoreRecord};
