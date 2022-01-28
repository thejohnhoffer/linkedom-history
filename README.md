# [Linkedom History](https://yarnpkg.com/package/linkedom-history)

[![npm version][npm_version]][npm_version_url]

[npm_version]: https://badge.fury.io/js/linkedom-history.svg
[npm_version_url]: https://www.npmjs.com/package/linkedom-history

## Installation and Example

Install peer dependencies, as well as `react`:

```
pnpm add history linkedom react
```

Then install this module

```
pnpm install linkedom-history
```

Or, run `npm install` or `yarn add`, based on your package manager. To [avoid duplicate dependencies](https://github.com/remix-run/react-router/pull/7586#issuecomment-991703987).

Use with a version of `likedom`, `history`, and `react` as follows:

```jsx
import { renderElement, resetDocument } from "./linkedom-history";
import { createElement } from "react";

function renderExample(props = {}) {
  const element = createElement("div", props);
  return renderElement("main", element);
}

function reset() {
  return resetDocument("main");
}
```

## Contributing

The published copy lives at [linkedom-history](https://github.com/thejohnhoffer/linkedom-history/) on GitHub.
Make any pull request against the main branch.

### Package manager

I build and test with [pnpm](https://pnpm.io/). I've tried `npm`, `yarn@1`, `yarn@berry`, but The [`uvu` testing library](https://www.npmjs.com/package/uvu) currently [recommendeds](https://github.com/lukeed/uvu/issues/144#issuecomment-939316208) `pnpm`.
