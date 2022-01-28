import { parseHTML } from "linkedom";
import { render } from "@testing-library/react";
import { parsePath, createMemoryHistory } from "history";

import type { To } from "history";
import type { ReactElement } from "react";

type DocumentKeys = "createEvent" | "dispatchEvent" | "querySelector";
type Doc = Required<Pick<Document, DocumentKeys>> & {
  defaultView: NonNullable<Document["defaultView"]>;
};

type Obj = Record<Key, unknown>;
type Key = string | number | symbol;
type Is<T> = (x: unknown) => x is T;
type HistFn = (to: To, _: unknown) => void;
type ProxyFn<I extends unknown[]> = (..._: I) => unknown;
type Handler = ProxyFn<[unknown]> | ProxyFn<[]>;

const isObj: Is<Obj> = (x): x is Obj => typeof x === "object";
const isDoc: Is<Doc> = (x): x is Doc => isObj(x) && "defaultView" in x;

const proxyGet = (object: unknown, key: Key, handler: Handler) => {
  if (isObj(object)) {
    return new Proxy(object, {
      get(target, prop, _) {
        if (prop !== key) {
          return Reflect.get(target, prop, _);
        }
        return handler(target);
      },
    });
  }
};

const proxyApplyUrl = (fn: HistFn) => {
  return new Proxy(fn, {
    apply(_fn, _this, [state, _, url]) {
      return _fn(parsePath(url), state);
    },
  });
};

const makeGlobalDocument = (main: string) => {
  const popstate = "popstate";
  const root = `<${main}></${main}>`;
  const history = createMemoryHistory();
  const { document } = parseHTML(`<body>${root}</body>`);
  const popEvent = document.createEvent("CustomEvent");
  popEvent.initCustomEvent(popstate, false, false, null);
  history.listen(() => document.dispatchEvent(popEvent));
  return proxyGet(document, "defaultView", (doc: unknown) => {
    if (isDoc(doc)) {
      const win = proxyGet(doc.defaultView, "history", () => {
        return new Proxy(history, {
          get(targetHistory, prop, _) {
            switch (prop) {
              case "pushState":
                return proxyApplyUrl(targetHistory.push);
              case "replaceState":
                return proxyApplyUrl(targetHistory.replace);
              default:
                return Reflect.get(targetHistory, prop, _);
            }
          },
        });
      });
      const toLocation = () => {
        return history.location;
      };
      return proxyGet(win, "location", toLocation);
    }
  });
};

const resetDocument = (main: string) => {
  const doc = makeGlobalDocument(main);
  if (isObj(global) && isDoc(doc)) {
    ((g: Obj, doc: Doc) => {
      g.window = { HTMLIFrameElement: Boolean };
      g.IS_REACT_ACT_ENVIRONMENT = true;
      g.document = doc;
    })(global, doc);
    return true;
  }
  return false;
};

const find = (document: Doc, main: string) => {
  return document.querySelector(main) || undefined;
};

const renderElement = (main: string, element: ReactElement) => {
  const container = find(global.document as Doc, main);
  render(element, { container });
  return container;
};

export { renderElement, resetDocument };
