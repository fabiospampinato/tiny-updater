
/* MAIN */

type Options = {
  /**
   * The name of the package to check for.
   */
  name: string,

  /**
   * The current version of the package.
   */
  version: string,

  /**
   * Cache duration in milliseconds between update checks. When set, update
   * notifications will only appear after this time has passed since the last check,
   * preventing repeated notifications and reducing HTTP requests to the npm registry.
   *
   * @default 0
   */
  ttl?: number
};

type StoreRecord = {
  timestampFetch: number,
  timestampNotification: number,
  version: string
};

/* EXPORT */

export type {Options, StoreRecord};
