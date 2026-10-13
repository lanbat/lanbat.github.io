// Get-started tabs and copy buttons. Without JavaScript every guide is shown in full.
(() => {
  const root = document.querySelector("[data-tabs]");
  if (root) {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    const byKey = (key) => tabs.findIndex((t) => t.id === "tab-" + key);

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i));
      t.addEventListener("keydown", (e) => {
        const n = tabs.length;
        const to = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (to !== undefined) { e.preventDefault(); select(to, true); }
      });
    });

    document.querySelectorAll("[data-tab-link]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const i = byKey(a.dataset.tabLink);
        if (i < 0) return;
        e.preventDefault();
        select(i);
        root.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", "#start-" + a.dataset.tabLink);
      });
    });

    const fromHash = byKey(location.hash.replace("#start-", ""));
    select(fromHash >= 0 ? fromHash : 0);
    root.classList.add("is-ready");
    if (fromHash >= 0) root.scrollIntoView({ block: "start" });
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.setAttribute("aria-label", "Copy command");
    btn.addEventListener("click", async () => {
      const text = btn.parentElement.querySelector("code").innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Select and copy";
      }
      setTimeout(() => { btn.textContent = "Copy"; }, 1600);
    });
  });
})();
