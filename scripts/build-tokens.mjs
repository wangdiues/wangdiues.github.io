import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(
  readFileSync(resolve(root, "tokens/tokens.json"), "utf8")
);

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, val]) => {
    const path = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === "object" && !("value" in val))
      return flatten(val, path);
    const raw = String(val.value);
    const resolved = raw.startsWith("{")
      ? `var(--${raw.slice(1, -1).replaceAll(".", "-")})`
      : raw;
    return [[`--${path.replaceAll(".", "-")}`, resolved]];
  });
}

const lines = flatten(tokens)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join("\n");

const css = `:root {\n${lines}\n}\n`;

mkdirSync(resolve(root, "src/styles"), { recursive: true });
writeFileSync(resolve(root, "src/styles/tokens.css"), css);
console.log(`tokens.css written (${lines.split("\n").length} tokens)`);
