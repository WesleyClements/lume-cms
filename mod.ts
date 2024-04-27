import Cms, { CmsOptions } from "./core/cms.ts";

import defaultFields from "./fields/core.ts";

export default function (options?: Partial<CmsOptions>): Cms {
  const cms = new Cms(options);

  for (const [name, field] of defaultFields) {
    cms.field(name, field);
  }

  return cms;
}
