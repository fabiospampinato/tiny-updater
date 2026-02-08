
/* MAIN */

type Options = {
  name: string,
  version: string,
  ttl?: number
};

type Package = {
  version: string
};

type Record = {
  timestamp: number,
  version: string
};

/* EXPORT */

export type {Options, Package, Record};
