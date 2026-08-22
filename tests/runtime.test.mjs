import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { contentSlug } from "../src/lib/content-id.ts";
import {
  displayValue,
  pageBounds,
  waitForMapLoad,
} from "../src/lib/map-runtime.ts";

test("content IDs always produce extensionless slugs", () => {
  assert.equal(contentSlug("aquatic-beetles.md"), "aquatic-beetles");
  assert.equal(contentSlug("camera-trap-monitoring.mdx"), "camera-trap-monitoring");
  assert.equal(contentSlug("already-clean"), "already-clean");
});

test("map readiness waits for the load event", async () => {
  let listener;
  let resolved = false;
  const promise = waitForMapLoad({
    once(event, callback) {
      assert.equal(event, "load");
      listener = callback;
    },
  }).then(() => {
    resolved = true;
  });
  await Promise.resolve();
  assert.equal(resolved, false);
  listener();
  await promise;
  assert.equal(resolved, true);
});

test("pagination exposes records beyond the first 50", () => {
  assert.deepEqual(pageBounds(0, 121), { start: 0, end: 50 });
  assert.deepEqual(pageBounds(1, 121), { start: 50, end: 100 });
  assert.deepEqual(pageBounds(2, 121), { start: 100, end: 121 });
});

test("display values preserve HTML-looking input as plain text", () => {
  assert.equal(displayValue('<img src=x onerror="alert(1)">'), '<img src=x onerror="alert(1)">');
});

test("the map client never inserts dataset-derived HTML", () => {
  const source = readFileSync("src/pages/explore.astro", "utf8");
  assert.equal(source.includes("innerHTML"), false);
  assert.match(source, /\.textContent\s*=/);
  assert.match(source, /waitForMapLoad\(map\)/);
});
