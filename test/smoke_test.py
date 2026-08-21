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
  5. Genus regex search ('^A') returns genera.
  6. Family regex search ('ceae$') returns families.

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

from firefox_tester import FirefoxTester  # noqa: E402
from selenium.webdriver.common.by import By  # noqa: E402

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

        # 5. Genus regex search: '^A' (full reload, re-install hook)
        t.navigate(BASE + "/search")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        t.wait(3)
        t.execute_script(HOOK)
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='genus']", "^A")
        t.click(By.XPATH, "//button[contains(., 'Search genus')]")
        t.wait_for_url_contains("/genus_regex/", timeout=30)
        t.wait(4)
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        check("genus regex '^A' returns genera", "Genera" in heading and "0 Genera" not in heading, f"'{heading}'")

        # 6. Family regex search: 'ceae$'
        t.navigate(BASE + "/search")
        t.wait_for_text(By.CSS_SELECTOR, "h1", TITLE, timeout=30)
        t.wait(3)
        t.execute_script(HOOK)
        t.type_text(By.CSS_SELECTOR, "input[formcontrolname='family']", "ceae$")
        t.click(By.XPATH, "//button[contains(., 'Search family')]")
        t.wait_for_url_contains("/family_regex/", timeout=30)
        t.wait(4)
        heading = t.get_text(By.CSS_SELECTOR, "h2").strip()
        check("family regex 'ceae$' returns families", "Families" in heading and "0 Families" not in heading, f"'{heading}'")

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
