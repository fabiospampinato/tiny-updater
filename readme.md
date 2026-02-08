# Tiny Updater

A small update notifier for NPM packages, useful for CLI apps.

## Pros & Cons

This is basically a bare-bones alternative to [update-notifier](https://github.com/yeoman/update-notifier), with all the pros and cons of that.

- **Small**: This library has only a handful of small dependencies I maintain. This library weighs about ~5kb total.
- **Bundler-ready**: This library can be bundled, which is important for achieving the best startup times. `update-notifier` on the other hand uses highly dyanmic imports and spawns a child process, if you are using it you can't bundle your CLI app.
- **Fast**: Startup performance is paramount for CLI apps, in order to improve that you need to bundle your app and make the bundle as small as possible, using this library won't compromise your startup times much.
- **Bare-bones**: Being lightweight comes at a cost, that cost is mainly less visually-sophisticated update messages written to the console compared to `update-notifier`, but still I think the output is pretty good.
- **Work in progress**: While this library should suit most use cases it's currently less flexible than `update-notifier`, if you need something fancy this may not work for you.

## Install

```sh
npm install tiny-updater
```

## Usage

The following options are supported:

```ts
type Options = {
  // The name of the package to check for updates on the registry
  name: string,
  // The current version of the package, used to check if an update is available compared to this version
  version: string,
  // A function to print the update message in your own way
  print?: ({ name, current, latest }) => void,
  // Some options for customizing how the registry is being queried
  registry?: {
    // Map of custom additional headers to set when querying the registry
    headers?: {},
    // The URL for the registry to query, it defaults to NPM
    url?: string
  },
  // Time to wait before checking for updates again
  ttl?: number
};
```

This is how you'd use it:

```ts
import updater from 'tiny-updater';
import {name, version} from './package.json';

// Let's check for updates

await updater ({
  name,
  version,
  ttl: 86_400_000
});

// If there are no updates available:
// 1. `false` is returned
// 2. Nothing is logged to the console

// If there is an update available:
// 1. `true` is returned
// 2. At most once a day, right before the process exits, a message like the following is logged to the console:
// 📦 Update available for example-package: 0.1.0 → 1.0.0
```

## License

MIT © Fabio Spampinato
