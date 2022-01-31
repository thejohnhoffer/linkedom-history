# [Linkedom History](https://yarnpkg.com/package/linkedom-history)

[![npm version][npm_version]][npm_version_url]

[npm_version]: https://badge.fury.io/js/linkedom-history.svg
[npm_version_url]: https://www.npmjs.com/package/linkedom-history

This is a package that adds [history][history] to [linkedom][linkedom];

[history]: https://github.com/remix-run/history
[linkedom]: https://github.com/WebReflection/linkedom

## Installation and Example

Install peer dependencies:

```
pnpm add history linkedom
```

Then install this module

```
pnpm install linkedom-history
```

Or, run `npm install` or `yarn add`, based on your package manager. Use with a version of `likedom` and `history` as follows:

```jsx
import { parseHTML } from "linkedom-history";

const doc = parseHTML("<body></body>").document;
const { history, location } = doc.defaultView;
```

The `parseHTML` function acts in place of the function of the same name from `linkedom`. The `linkedom-history` also provides `renderElement` and `resetDocument` for testing `React` libraries.

## Contributing

The published copy lives at [linkedom-history](https://github.com/thejohnhoffer/linkedom-history/) on GitHub.
Make any pull request against the main branch.

### Package manager

I build and test with [pnpm](https://pnpm.io/). I've tried `npm`, `yarn@1`, `yarn@berry`, but The [`uvu` testing library](https://www.npmjs.com/package/uvu) currently [recommendeds](https://github.com/lukeed/uvu/issues/144#issuecomment-939316208) `pnpm`.
