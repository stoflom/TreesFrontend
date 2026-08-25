#!/usr/bin/env python3
"""
Browser smoke test for the SATrees frontend.

Drives a headless Firefox (via the firefox-testing skill's FirefoxTester,
Selenium + GeckoDriver) against the Angular dev server with API proxy:

    ng serve --proxy-config proxy.json        # on :4200
    (backend running, see TreesBackend)

Checks:
  1. App boots and redirects to /search, title renders.
  2. Version header matches the backend /api/version response.
  3. Perl-regex common-name search (English 'marula') returns 6 trees.
  4. A result links to the tree detail page, which renders.
  5. Regex encode/decode round-trip (5a/5b/5c): search terms containing special
     characters ('wood\u2020?$', 'ceae$', '^A') are percent-encoded by
     TreehttpService.encode() (encodeURIComponent), the backend decodes
     the path segment and applies the ORIGINAL regex to MongoDB. Verified
     two ways per term:
       a. the app log shows the exact encoded API URL segment, and
       b. the result count equals the known-good count from the pre-change
          version (DB is static): 212 / 132 / 45.

Debug console access:
  A console + XHR network hook is installed after the initial page load.
  Because the app is an SPA, in-app (router) navigation keeps the hook
  alive, so console errors and API calls made during the test are
  captured and printed at the end (and on failure).

Usage:
    python3 test/smoke_test.py [base_url]

    base_url defaults to http://localhost:4200

Requires:
  - Firefox on PATH
  - The firefox-testing skill (FirefoxTester) — path overridable via
    FIREFOX_TESTING_SKILL env var.
"""

import os
import sys

skill_path = os.environ.get(
    "FIREFOX_TESTING_SKILL", "/home/stoflom/.pi/agent/skills/firefox-testing"
)
if skill_path not in sys.path:
    sys.path.append(skill_path)

import firefox_tester  # noqa: E402
from firefox_tester import FirefoxTester  # noqa: E402
from selenium.webdriver.common.by import By  # noqa: E402


def _cached_geckodriver():
    """Newest locally cached geckodriver (webdriver-manager cache), if any."""
    import glob
    pattern = os.path.expanduser("~/.cache/selenium/geckodriver/linux64/*/geckodriver")
    cached = sorted(glob.glob(pattern))
    return cached[-1] if cached else None


# Pin geckodriver to the local cache when available so the test also runs
# without internet access (webdriver-manager otherwise queries GitHub for
# the latest version). Set SKIP_GECODRIVER_PIN=1 to force the normal
# webdriver-manager flow.
if os.environ.get("SKIP_GECODRIVER_PIN") != "1":
    _cached = _cached_geckodriver()
    if _cached:

        class _CachedGeckoDriverManager:
            def install(self):
                return _cached

        firefox_tester.GeckoDriverManager = _CachedGeckoDriverManager

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4200"

TITLE = "Dictionary of Names for Southern African Trees"

# Installs console + XHR capture on window.__logs. Survives SPA (router)
# navigation; wiped by full page loads (re-install after t.navigate()).
HOOK = r"""
window.__logs = [];
const oe = console.error, ow = console.warn;
console.error = (...a) => { window.__logs.push('ERROR: ' + a.map(String).join(' ').slice(0, 300)); oe(...a); };
console.warn  = (...a) => { window.__logs.push('WARN:  ' + a.map(String).join(' ').slice(0, 200)); ow(...a); };
window.addEventListener('error', e => window.__logs.push('ONERROR: ' + e.message));
window.addEventListener('unhandledrejection', e => window.__logs.push('REJECT: ' + String(e.reason).slice(0, 200)));
const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; this.__m = m; return oo.apply(this, arguments); };
XMLHttpRequest.prototype.send = function () {
  this.addEventListener('loadend', () => {
    window.__logs.push('NET: ' + this.__m + ' ' + this.__u + ' -> ' + this.status);
  });
  return os.apply(this, arguments);
};
return 'hooked';
"""

failures = []


def check(name, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"{status}: {name}" + (f" ({detail})" if detail else ""))
    if not condition:
        failures.append(name)
    return condition


def log_text(t):
    """Text of the app's message log panel (TreehttpService URLs etc.)."""
    if not t.is_element_present(By.CSS_SELECTOR, "app-messages", timeout=5):
        return ""
    return t.get_text(By.CSS_SELECTOR, "app-messages")


def dump_logs(t, label):
    logs = t.execute_script("return window.__logs || []")
    print(f"--- captured console/network [{label}] ---")
    for line in logs:
        print("   ", line[:220])


def main():
    with FirefoxTester(headless=True) as t:
        # 1. App boots, redirects to /search
        t.navigate(BASE + "/")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        check("app boots and title renders", True)

        t.wait(3)
        t.execute_script(HOOK)

        # 2. Version header matches backend /api/version
        t.wait(7)
        version = t.get_text(By.CSS_SELECTOR, "h1.version").strip()
        api_version = t.execute_script(
            "return fetch('/api/version').then(r => r.json()).then(j => j.version)"
        )
        check(
            "version header matches backend",
            version == api_version,
            f"header='{version}' backend='{api_version}'",
        )

        # 3. Regex name search: 'marula' in English
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='searchterm']", "marula")
        t.click(By.XPATH, "//button[contains(., 'Search names')]")
        t.wait_for_url_contains("/trees/Eng/marula", timeout=30)
        t.wait(4)
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        rows = t.execute_script("return document.querySelectorAll('table tr').length")
        name_search_ok = check(
            "name search 'marula' returns 6 trees",
            "6 Trees" in heading, f"'{heading}', rows={rows}",
        )

        # 4. First result links to detail page (needs step 3 results)
        if name_search_ok:
            t.click(By.CSS_SELECTOR, "table a")
            t.wait_for_url_contains("/detail/", timeout=30)
            t.wait_for_text(By.CSS_SELECTOR, "h2.detail", "Lannea", timeout=30)
            check("tree detail page renders", True, t.get_text(By.CSS_SELECTOR, "h2.detail").strip())
        else:
            check("tree detail page renders", False, "skipped: no search results")

        # 5. Regex encode/decode round-trip: special characters in the search
        # term must survive  form -> router URL -> TreehttpService.encode()
        # (encodeURIComponent) -> Express path-param decode -> MongoDB $regex.
        # The DB is static, so the known-good counts from the pre-change
        # version are the ground truth.

        # 5a. Name search with default term 'wood\u2020?$' (thorn, '?', '$') -> 212 trees
        t.navigate(BASE + "/search")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        t.wait(3)
        t.execute_script(HOOK)
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='searchterm']", "wood\u2020?$")
        t.click(By.XPATH, "//button[contains(., 'Search names')]")
        t.wait_for_url_contains("/trees/Eng/", timeout=30)
        t.wait(6)  # 212 results take a moment to render
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        check(
            "name search 'wood\u2020?$' returns 212 trees",
            heading == "Found 212 Trees", f"'{heading}'",
        )
        log = log_text(t)
        check(
            "cnlan API URL segment is percent-encoded (wood\u2020?$ -> wood%E2%80%A0%3F%24)",
            "cnlan/Eng/wood%E2%80%A0%3F%24" in log,
            "no encoded URL in app log",
        )

        # 5b. Genus regex '^A' -> 45 genera
        t.navigate(BASE + "/search")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        t.wait(3)
        t.execute_script(HOOK)
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='genus']", "^A")
        t.click(By.XPATH, "//button[contains(., 'Search genus')]")
        t.wait_for_url_contains("/genus_regex/", timeout=30)
        t.wait(4)
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        check(
            "genus regex '^A' returns 45 genera",
            heading == "Found 45 Genera", f"'{heading}'",
        )
        log = log_text(t)
        check(
            "genus API URL segment is percent-encoded (^A -> %5EA)",
            "genus/regex/%5EA" in log,
            "no encoded URL in app log",
        )

        # 5c. Family regex 'ceae$' -> 132 families
        t.navigate(BASE + "/search")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        t.wait(3)
        t.execute_script(HOOK)
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='family']", "ceae$")
        t.click(By.XPATH, "//button[contains(., 'Search family')]")
        t.wait_for_url_contains("/family_regex/", timeout=30)
        t.wait(4)
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        check(
            "family regex 'ceae$' returns 132 families",
            heading == "Found 132 Families", f"'{heading}'",
        )
        log = log_text(t)
        check(
            "family API URL segment is percent-encoded (ceae$ -> ceae%24)",
            "family/regex/ceae%24" in log,
            "no encoded URL in app log",
        )

        try:
            t.screenshot("/tmp/trees-smoke.png")
        finally:
            dump_logs(t, "final")

    if failures:
        print(f"\n{len(failures)} CHECK(S) FAILED: {failures}")
        sys.exit(1)
    print("\nALL SMOKE TESTS PASSED")


if __name__ == "__main__":
    main()
