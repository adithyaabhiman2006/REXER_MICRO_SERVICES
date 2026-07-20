const importUrl = new Function("url", "return import(url)") as (url: string) => Promise<any>;
export async function loadCDN(packageUrl: string): Promise<any> {
  const mod = await importUrl(packageUrl);
  return mod.default ?? mod;
}
export const esm = (pkg: string, version = "") => `https://esm.sh/${pkg}${version ? `@${version}` : ""}`;

export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function waitForGlobal(name: string, timeout = 15000): Promise<any> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if ((window as any)[name]) return resolve((window as any)[name]);
      if (Date.now() - start > timeout) return reject(new Error(`${name} did not load`));
      setTimeout(tick, 50);
    };
    tick();
  });
}
