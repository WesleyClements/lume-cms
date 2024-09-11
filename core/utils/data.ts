import type { Data, ResolvedField } from "../../types.ts";

/**
 * Converts a list of changes to an object:
 * {
 *   "changes.0.one": "value one",
 *   "changes.0.two": "value two"
 * }
 * Becomes:
 * {
 *   changes: {
 *   [
 *    {
 *     one: "value one",
 *     two: "value two",
 *    }
 *   ]
 * }
 */
export function changesToData(
  changes: Record<string, unknown>,
): Data {
  const data: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(changes)) {
    const parts = key.split(".");
    // deno-lint-ignore no-explicit-any
    let item: any = data;

    while (true) {
      let part = parts.shift()!;

      // if it's a numeric string prepend 0 to avoid automatic sorting
      if (part === "0" || part.match(/^[1-9]\d*$/)) {
        part = `0${part}`;
      }

      if (!parts.length) {
        item[part] = value;
        break;
      }

      if (part in item) {
        item = item[part];
        continue;
      }

      item[part] = {};
      item = item[part];
    }
  }

  return data.changes as Data;
}

export async function prepareField(
  field: ResolvedField,
): Promise<ResolvedField> {
  const json = { ...field };

  if (field.fields) {
    json.fields = await Promise.all(field.fields.map(prepareField));
  }

  if (field.init) {
    await field.init(json);
  }

  return json;
}

export function getDefaultValue(field: ResolvedField): unknown {
  if (field.fields && !field.type.endsWith("-list")) {
    const values = {} as Data;
    for (const f of field.fields) {
      values[f.name] = getDefaultValue(f);
    }
    return values;
  }

  return field.value ?? null;
}
