/**
 * Auto-update checker for game data / app manifest
 * Fetches data/manifest.json, compares versions, notifies user.
 * Designed so missions, items, settings can be refreshed after redeploy.
 */

const UpdateChecker = (function () {
  const MANIFEST_URL = "data/manifest.json";
  const LOCAL_KEY = "got_manifest_cache";
  const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour default
  let timer = null;

  function getLocalCache() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setLocalCache(manifest) {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({
        dataVersion: manifest.dataVersion,
        appVersion: manifest.appVersion,
        lastUpdated: manifest.lastUpdated,
        checkedAt: Date.now()
      })
    );
  }

  async function fetchManifest() {
    const url = MANIFEST_URL + "?t=" + Date.now();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Manifest fetch failed: " + res.status);
    return res.json();
  }

  function showBanner(manifest, isNew) {
    let el = document.getElementById("updateBanner");
    if (!el) {
      el = document.createElement("div");
      el.id = "updateBanner";
      el.className = "update-banner";
      document.body.appendChild(el);
    }
    if (isNew) {
      el.innerHTML = `
        <span class="update-dot"></span>
        <span><strong>NEW INTEL</strong> — Data ${escapeHtml(manifest.dataVersion)} · App ${escapeHtml(manifest.appVersion)}. Refresh to load latest missions & settings.</span>
        <button type="button" class="btn btn-sm btn-primary" id="btnApplyUpdate">REFRESH NOW</button>
        <button type="button" class="btn btn-sm btn-ghost" id="btnDismissUpdate">Later</button>
      `;
      el.classList.add("visible", "has-update");
      document.getElementById("btnApplyUpdate")?.addEventListener("click", () => {
        setLocalCache(manifest);
        location.reload();
      });
      document.getElementById("btnDismissUpdate")?.addEventListener("click", () => {
        el.classList.remove("visible");
      });
    } else {
      const status = document.getElementById("updateStatus");
      if (status) {
        status.textContent = "DATA " + manifest.dataVersion + " · SYNCED";
      }
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function check(silent) {
    try {
      const manifest = await fetchManifest();
      const local = getLocalCache();
      const isNew =
        !local ||
        local.dataVersion !== manifest.dataVersion ||
        local.appVersion !== manifest.appVersion;

      if (!local) {
        setLocalCache(manifest);
        showBanner(manifest, false);
        updateFooter(manifest);
        return { ok: true, isNew: false, manifest };
      }

      if (isNew) {
        showBanner(manifest, true);
      } else if (!silent) {
        showBanner(manifest, false);
      }
      updateFooter(manifest);
      return { ok: true, isNew, manifest };
    } catch (err) {
      console.warn("[UpdateChecker]", err);
      const status = document.getElementById("updateStatus");
      if (status) status.textContent = "UPDATE CHECK FAILED";
      return { ok: false, error: String(err) };
    }
  }

  function updateFooter(manifest) {
    const v = document.getElementById("footerVersion");
    const r = document.getElementById("footerResearch");
    const s = document.getElementById("updateStatus");
    if (v && manifest.gameVersion) v.textContent = manifest.gameVersion;
    if (r && manifest.lastUpdated) {
      r.textContent = String(manifest.lastUpdated).slice(0, 10);
    }
    if (s) s.textContent = "DATA " + manifest.dataVersion + " · AUTO-CHECK ON";
  }

  function start() {
    check(true);
    if (timer) clearInterval(timer);
    timer = setInterval(() => check(true), CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check(true);
    });
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  return { check, start, stop, getLocalCache };
})();

window.UpdateChecker = UpdateChecker;
