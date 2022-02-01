import { suite } from "uvu";
import * as assert from "uvu/assert";
import { parseHTML, resetDocument } from "../src/index.ts";
import { renderElement } from "../src/index.ts";
import * as React from "react";

const testParser = (key, props) => {
  const { expected } = props;
  const TestParser = suite(`test ${key}`);
  const doc = parseHTML("<body></body>").document;

  TestParser("parseHTML location", () => {
    const { pathname } = doc.defaultView?.location;
    assert.is(pathname, expected.pathname);
  });

  TestParser("parseHTML history", () => {
    const { location } = doc.defaultView?.history;
    assert.is(location?.pathname, expected.pathname);
  });

  return TestParser;
};

const useListener = (history, expected) => {
  return (key) => {
    const out = new Promise((resolve) => {
      history.listen(() => resolve(history.location));
    });
    history[key]({}, "", expected.pathname);
    return out;
  };
};

const testNavigate = (key, props) => {
  const { expected } = props;
  const TestNavigate = suite(`test ${key}`);
  const ok = resetDocument("main");
  const doc = global.document;
  const { history } = doc.defaultView;
  const listener = useListener(history, expected);

  TestNavigate("resetDocument ok", () => {
    assert.is(ok, true);
  });

  TestNavigate("history pushState", async () => {
    const { pathname } = await listener("pushState");
    assert.is(pathname, expected.pathname);
  });

  TestNavigate("history pushState", async () => {
    const { pathname } = await listener("replaceState");
    assert.is(pathname, expected.pathname);
  });

  return TestNavigate;
};

const testRender = (key, props) => {
  const { expected } = props;
  resetDocument("main");
  const doc = global.document;
  const { history } = doc.defaultView;
  const TestRender = suite(`test ${key}`);

  TestRender("renderElement", () => {
    const div = React.createElement("div", null, null);
    const { innerHTML } = renderElement("main", div);
    assert.snapshot(innerHTML, expected.html);
  });

  return TestRender;
};

[
  testParser("parser", {
    expected: {
      pathname: "/",
    },
  }),
  testNavigate("navigate", {
    expected: {
      pathname: "/123",
    },
  }),
  testRender("render", {
    expected: {
      html: "<div></div>",
    },
  }),
].map((test) => test.run());
