import { pickMin } from "./array";
import { MetaUrl } from "../constants";

/**
 * Using a template MetaUrl, construct URL slug using args in place of variables.
 * @param type Type of MetaUrl to create.
 * @param args Values to be inserted.
 * @returns New URL slug created from parameters..
 */
export function createMetaUrl(type: MetaUrl, ...args: string[]): string {
  const parts = type.split("{}");
  return parts.map((x, i) => (i < parts.length - 1 && args[i]) ? x + args[i] : x).join("");
}

/**
 * Parse an existing URL into known MetaUrl type and any inserted args
 * @param url URL to parse.
 * @returns Array of parsed kind of MetaURL followed by args if they exist.
 * @throws Error If an unknown URL is provided.
 */
export function parseMetaUrl(url: string): [MetaUrl, ...string[]] {
  const solutions: [MetaUrl, ...string[]][] = [];

  const path = new URL(url).pathname;
  for (const metaUrlKind in MetaUrl) {
    const urlTemplate: MetaUrl = MetaUrl[metaUrlKind];
    const regex = new RegExp("^" + (urlTemplate as String).replaceAll("{}", "([^/]*)") + "$");
    const result = regex.exec(path);
    if (result != null) {
      solutions.push([urlTemplate as MetaUrl, ...result.slice(1)]);
    }
  }

  if (solutions.length === 0)
    throw new Error(`Invalid parsed URL: ${url}.`);

  // pick solution with least args
  // i.e., in "/kb/create" there's no args
  console.log(solutions, "->", pickMin(solutions, sol => sol.length));
  return pickMin(solutions, sol => sol.length);
}
