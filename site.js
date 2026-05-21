(function () {
  const defaults = window.InboqaDefaults || {};
  const storeKeys = {
    articles: "inboqa.cms.articles",
    sections: "inboqa.cms.sections",
    pages: "inboqa.cms.pages",
    theme: "inboqa.theme",
  };
  function initSite() {
    hydrateTheme();
    renderHeader();
    renderAdsensePlaceholders();
    renderDirectAdLink();
    installQugeAdTags();
    renderFooter();
    renderArticles();
    renderArticlePage();
    renderDynamicPage();
    renderCustomSections();
    bindTheme();
    registerServiceWorker();
    refreshIcons();
  }

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function getArticles() {
    const custom = readStore(storeKeys.articles, []);
    return [...custom, ...(defaults.articles || [])];
  }

  function getPages() {
    const custom = readStore(storeKeys.pages, []);
    return [...(defaults.nav || []), ...custom.map((page) => ({
      label: page.title,
      href: `page?slug=${encodeURIComponent(page.slug)}`,
    }))];
  }

  function hydrateTheme() {
    if (localStorage.getItem(storeKeys.theme) === "dark") {
      document.documentElement.classList.add("dark");
    }
  }

  function bindTheme() {
    const toggle = document.querySelector("#themeToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem(
        storeKeys.theme,
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
      refreshIcons();
    });
  }

  function renderHeader() {
    const target = document.querySelector("[data-site-header]");
    if (!target) return;

    const page = document.body.dataset.page || "";
    const action = page === "home"
      ? `<button class="ghost-button" id="newEmailTop" type="button"><i data-lucide="shuffle"></i> بريد جديد</button>`
      : `<a class="ghost-button" href="./#inbox"><i data-lucide="mail-plus"></i> ابدأ الآن</a>`;

    target.innerHTML = `
      <header class="topbar">
        <a class="brand" href="./" aria-label="الصفحة الرئيسية">
          ${logoMarkup()}
          <span>
            <strong>Inboqa Mail</strong>
            <small>بريد مؤقت سريع</small>
          </span>
        </a>
        <div class="top-actions">
          <button class="icon-button" id="themeToggle" type="button" aria-label="تبديل الوضع">
            <i data-lucide="moon"></i>
          </button>
          ${action}
        </div>
      </header>
    `;
  }

  function adSensePlaceholder(name, extraClass = "") {
    return `
      <section class="adsense-reserved-slot ${extraClass}" data-adsense-placeholder="${escapeHtml(name)}" aria-label="Google AdSense ad space">
        <span>Google AdSense</span>
      </section>
    `;
  }

  function renderAdsensePlaceholders() {
    const page = document.querySelector(".page") || document.querySelector(".admin-shell");
    if (!page || document.querySelector("[data-adsense-placeholders]")) return;

    const topAnchor = document.body.dataset.page === "home"
      ? document.querySelector(".hero-panel")
      : document.querySelector("[data-site-header]");
    const middleAnchor = document.body.dataset.page === "home"
      ? document.querySelector("#inbox")
      : document.querySelector(".content-section");
    const footerAnchor = document.querySelector("[data-site-footer]");

    const group = document.createElement("div");
    group.className = "adsense-placeholder-group";
    group.dataset.adsensePlaceholders = "true";

    const topSlot = adSensePlaceholder("top", "page-ad adsense-wide");
    const middleSlot = adSensePlaceholder("middle", "adsense-wide");
    const bottomSlot = adSensePlaceholder("bottom", "footer-ad adsense-wide");

    if (topAnchor) topAnchor.insertAdjacentHTML("afterend", topSlot);
    else page.insertAdjacentHTML("afterbegin", topSlot);

    if (middleAnchor) middleAnchor.insertAdjacentHTML("afterend", middleSlot);

    if (footerAnchor) footerAnchor.insertAdjacentHTML("beforebegin", bottomSlot);
    else page.insertAdjacentHTML("beforeend", bottomSlot);

    page.appendChild(group);
  }

  function renderDirectAdLink() {
    const page = document.querySelector(".page") || document.querySelector(".admin-shell");
    if (!page || document.querySelector("[data-direct-ad-link]")) return;

    const anchor = document.body.dataset.page === "home"
      ? document.querySelector("#inbox")
      : document.querySelector(".adsense-reserved-slot");

    const markup = `
      <section class="external-direct-ad" data-direct-ad-link>
        <a href="https://omg10.com/4/11039152" target="_blank" rel="nofollow sponsored noopener">
          Sponsored link
        </a>
      </section>
    `;

    if (anchor) anchor.insertAdjacentHTML("afterend", markup);
    else page.insertAdjacentHTML("beforeend", markup);
  }

  function installQugeAdTags() {
    if (document.querySelector("[data-quge-zone='241696']")) return;

    ["241696", "241694"].forEach((zone) => {
      const script = document.createElement("script");
      script.src = "https://quge5.com/88/tag.min.js";
      script.async = true;
      script.dataset.zone = zone;
      script.dataset.cfasync = "false";
      script.dataset.qugeZone = zone;
      document.head.appendChild(script);
    });
  }

  function renderFooter() {
    const target = document.querySelector("[data-site-footer]");
    if (!target) return;
    const navItems = getPages()
      .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
      .join("");

    target.innerHTML = `
      <footer class="site-footer">
        <nav class="footer-nav" aria-label="روابط الصفحات">${navItems}</nav>
        <div>
          <a class="brand" href="./">
            ${logoMarkup()}
            <span>
              <strong>Inboqa Mail</strong>
              <small>بريد مؤقت لاستقبال رسائل التفعيل</small>
            </span>
          </a>
          <p>أداة بريد مؤقت تساعدك على تقليل السبام وحماية بريدك الحقيقي عند التجارب القصيرة.</p>
        </div>
        <div class="footer-links">
          <a href="about">عن الموقع</a>
          <a href="privacy">سياسة الخصوصية</a>
          <a href="terms">الشروط</a>
          <a href="contact">تواصل</a>
          <a href="blog">المقالات</a>
        </div>
        <p class="footer-note">© 2026 Inboqa Mail. لا تستخدم البريد المؤقت لاستقبال معلومات حساسة أو حسابات تحتاج إلى استرداد طويل المدى.</p>
      </footer>
    `;
  }

  function logoMarkup() {
    return `
      <img class="brand-logo" src="assets/inboqa-icon-192.png" alt="" width="72" height="72" loading="eager" decoding="async" />
    `;
  }

  function renderArticles() {
    document.querySelectorAll("[data-article-list]").forEach((target) => {
      const limit = Number(target.dataset.limit || 100);
      target.innerHTML = getArticles()
        .slice(0, limit)
        .map((article) => articleCard(article))
        .join("");
    });
  }

  function renderArticlePage() {
    const target = document.querySelector("[data-article-detail]");
    if (!target) return;

    const slug = new URLSearchParams(location.search).get("slug") || defaults.articles?.[0]?.slug;
    const article = getArticles().find((item) => item.slug === slug) || getArticles()[0];
    if (!article) {
      target.innerHTML = `<p>لا توجد مقالات بعد.</p>`;
      return;
    }

    document.title = `${article.title} | Inboqa Mail`;
    target.innerHTML = `
      <article class="article-page">
        <p class="eyebrow">${escapeHtml(article.category)} · ${formatDate(article.date)}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <p class="lead">${escapeHtml(article.excerpt)}</p>
        <div class="prose">${paragraphs(article.content)}</div>
      </article>
    `;
  }

  function renderDynamicPage() {
    const target = document.querySelector("[data-dynamic-page]");
    if (!target) return;

    const slug = new URLSearchParams(location.search).get("slug");
    const page = readStore(storeKeys.pages, []).find((item) => item.slug === slug);
    if (!page) {
      target.innerHTML = `
        <section class="content-section">
          <p class="eyebrow">صفحة غير موجودة</p>
          <h1>لم يتم العثور على الصفحة.</h1>
          <p>يمكن إنشاء صفحات جديدة من لوحة التحكم المخفية.</p>
        </section>
      `;
      return;
    }

    document.title = `${page.title} | Inboqa Mail`;
    target.innerHTML = `
      <section class="content-section page-content">
        <p class="eyebrow">صفحة مخصصة</p>
        <h1>${escapeHtml(page.title)}</h1>
        <div class="prose">${paragraphs(page.content)}</div>
      </section>
    `;
  }

  function renderCustomSections() {
    const target = document.querySelector("#customSections");
    if (!target) return;

    const sections = readStore(storeKeys.sections, []);
    if (!sections.length) return;

    target.hidden = false;
    target.innerHTML = `
      <div class="section-head">
        <p class="eyebrow">محتوى مخصص</p>
        <h2>أقسام أضيفت من لوحة التحكم.</h2>
      </div>
      <div class="feature-grid">
        ${sections.map((section) => `
          <article class="feature-card">
            <i data-lucide="${escapeHtml(section.icon || "panel-top")}"></i>
            <h3>${escapeHtml(section.title)}</h3>
            <p>${escapeHtml(section.content)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function articleCard(article) {
    return `
      <article class="article-card">
        <p class="eyebrow">${escapeHtml(article.category)} · ${formatDate(article.date)}</p>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.excerpt)}</p>
        <a class="text-link" href="article?slug=${encodeURIComponent(article.slug)}">قراءة المقال</a>
      </article>
    `;
  }

  function paragraphs(value) {
    return String(value || "")
      .split(/\n{2,}/)
      .map((part) => `<p>${escapeHtml(part.trim())}</p>`)
      .join("");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(new Date(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol !== "https:") return;

    window.addEventListener("load", () => {
      const manifest = document.querySelector('link[rel="manifest"]');
      const baseUrl = manifest ? manifest.href : new URL("site.webmanifest", location.href).href;
      const workerUrl = new URL("sw.js?v=20260520-adsenseonly2", baseUrl);
      const scopeUrl = new URL("./", baseUrl);
      navigator.serviceWorker.register(workerUrl, { scope: scopeUrl.pathname })
        .then((registration) => registration.update())
        .catch(() => {});
    });
  }

  window.InboqaSite = {
    storeKeys,
    readStore,
    getArticles,
    getPages,
    refresh: initSite,
  };

  initSite();
})();
