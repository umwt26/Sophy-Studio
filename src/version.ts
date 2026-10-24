declare const __APP_VERSION__: string;

/** Full semver from package.json, e.g. "1.2.0". */
export const APP_VERSION: string = __APP_VERSION__;

/** Short label used across the UI, e.g. "v1.2" (patch omitted when it is 0). */
export const APP_VERSION_LABEL: string = (() => {
  const [major = "0", minor = "0", patch = "0"] = APP_VERSION.split(/[.-]/);
  return patch === "0" ? `v${major}.${minor}` : `v${major}.${minor}.${patch}`;
})();
