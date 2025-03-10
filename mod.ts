import Cms, { CmsOptions } from "./core/cms.ts";

import { defaultFields } from "./fields/core.ts";

export default (
  options?: Partial<CmsOptions>,
) => new Cms(options).use(defaultFields);
