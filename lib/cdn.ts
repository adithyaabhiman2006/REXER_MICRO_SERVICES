const importUrl = new Function("url", "return import(url)") as (url: string) => Promise<any>;
export async function loadCDN(packageUrl: string): Promise<any> {
  const mod = await importUrl(packageUrl);
  return mod.default ?? mod;
}
export const esm = (pkg: string, version = "") => `https://esm.sh/${pkg}${version ? `@${version}` : ""}`;
