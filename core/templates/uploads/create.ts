import { getPath } from "../../utils/path.ts";
import breadcrumb from "../breadcrumb.ts";

import type { CMSContent, Version } from "../../../types.ts";

interface Props {
  options: CMSContent;
  collection: string;
  version?: Version;
  folder?: string;
}

export default function template(
  { options, collection, version, folder }: Props,
) {
  const { basePath } = options;

  return `
${
    breadcrumb(options, version, [
      collection,
      getPath(basePath, "uploads", collection),
    ], "File details")
  }

<header class="header">
  <h1 class="header-title">
    Upload file
    <label class="header-file">
      <input
        class="input is-inline"
        id="_id"
        type="text"
        name="_id"
        placeholder="subfolder…"
        form="form-create"
        aria-label="File name"
        value="${folder || ""}"
      >
    </label>
  </h1>
</header>

<form
  method="post"
  class="form"
  enctype="multipart/form-data"
  id="form-create"
  action="${getPath(options.basePath, "uploads", collection, "create")}"
>
  <div class="field">
    <input
      aria-label="Upload file"
      id="new-file"
      type="file"
      name="file"
      required
      class="inputFile"
    >
  </div>
  <footer class="footer ly-rowStack">
    <button class="button is-primary" type="submit">
      <u-icon name="upload-simple"></u-icon>
      Upload file
    </button>
  </footer>
</form>
  `;
}
