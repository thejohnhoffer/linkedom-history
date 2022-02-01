import { parseHTML as parser } from "linkedom";
import { render } from "@testing-library/react";
import { parsePath, createMemoryHistory } from "history";

import type { To } from "history";
import type { ReactElement } from "react";

type DocumentKeys = "createEvent" | "dispatchEvent" | "querySelector";
type Doc = Required<Pick<Document, DocumentKeys>> & {
  defaultView: NonNullable<Document["defaultView"]>;
};

type Key = string | number | symbol;
type Is<T> = (x: unknown) => x is T;
type Obj<O = unknown> = Record<Key, O>;
type HistFn = (to: To, _: unknown) => void;

const isObj: Is<Obj> = (x): x is Obj => typeof x === "object";
const isDoc: Is<Doc> = (x): x is Doc => isObj(x) && "defaultView" in x;

const proxyApplyUrl = (fn: HistFn) => {
  return new Proxy(fn, {
    apply(_fn, _this, [state, _, url]) {
      return _fn(parsePath(url), state);
    },
  });
};

const parseHTML = (text: string) => {
  const history = createMemoryHistory();
  ((g: Obj) => {
    g.history = new Proxy(history, {
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
    g.location = history.location;
    g.window = {
      ...(g.window as Obj),
      HTMLIFrameElement: Boolean,
    };
    g.IS_REACT_ACT_ENVIRONMENT = true;
  })(global);

  return parser(text);
};

const resetDocument = (main: string) => {
  const root = `<${main}></${main}>`;
  const view = parseHTML(`<body>${root}</body>`);
  if (isObj(global) && isDoc(view.document)) {
    ((g: Obj, doc: Doc) => {
      g.document = doc;
    })(global, view.document);
    return true;
  }
};

const find = (document: Doc, main: string) => {
  return document.querySelector(main) || undefined;
};

const renderElement = (main: string, element: ReactElement) => {
  const container = find(global.document as Doc, main);
  render(element, { container });
  return container;
};

export { renderElement, resetDocument, parseHTML };
