import { defineConfig } from "sanity";
import { dataset, projectId } from "./env";
import { schemaTypes } from "./schemaTypes";

/**
 * Studio config. Do not schema-deploy: no Sanity project exists yet.
 * `unconfigured` is a local placeholder so extract/typegen can run.
 */
export default defineConfig({
  name: "streamline",
  title: "Streamline USA",
  projectId: projectId || "unconfigured",
  dataset,
  schema: { types: schemaTypes },
});
