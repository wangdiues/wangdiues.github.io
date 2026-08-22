export function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function pageBounds(page: number, total: number, pageSize = 50) {
  const safePage = Math.max(0, Math.floor(page));
  const start = Math.min(safePage * pageSize, total);
  return { start, end: Math.min(start + pageSize, total) };
}

export function waitForMapLoad(map: {
  once(event: "load", listener: () => void): unknown;
}): Promise<void> {
  return new Promise((resolve) => map.once("load", resolve));
}
