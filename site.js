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

  function renderPageAds() {
    const header = document.querySelector("[data-site-header]");
    if (!header || document.querySelector("[data-page-top-ad]")) return;

    header.insertAdjacentHTML("afterend", `
      <section class="ad-banner page-ad" data-page-top-ad aria-label="مساحة اعلانية">
        <span>مساحة اعلان Google AdSense</span>
        <strong>Responsive Display Ad</strong>
      </section>
    `);
  }

  function renderFooter() {
    const target = document.querySelector("[data-site-footer]");
    if (!target) return;
    const navItems = getPages()
      .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
      .join("");

    target.innerHTML = `
      <section class="ad-grid-block" aria-label="مساحات اعلانية قبل الفوتر">
        <div class="ad-slot ad-wide affiliate-ad-horizontal">
          <a class="affiliate-ad-link" href="https://www.coinpayu.com/?r=mha737r" target="_blank" rel="sponsored noopener">
            <img src="https://www.coinpayu.com/static/advertiser_banner/320X100_ru.gif" width="320" height="100" alt="Join Coinpayu to earn!" loading="lazy" decoding="async" />
          </a>
        </div>
        <div class="ad-slot ad-card affiliate-ad-card">
          <a class="affiliate-ad-link" href="https://www.coinpayu.com/?r=mha737r" target="_blank" rel="sponsored noopener">
            <img src="https://www.coinpayu.com/static/advertiser_banner/160X600.gif" width="160" height="600" alt="Join Coinpayu to earn!" loading="lazy" decoding="async" />
          </a>
        </div>
        <div class="ad-slot ad-card affiliate-ad-square">
          <a class="affiliate-ad-link" href="https://www.coinpayu.com/?r=mha737r" target="_blank" rel="sponsored noopener">
            <img src="https://www.coinpayu.com/static/advertiser_banner/300X250_es.gif" width="300" height="250" alt="Join Coinpayu to earn!" loading="lazy" decoding="async" />
          </a>
        </div>
        <div class="ad-slot ad-wide">
          <span>مساحة اعلان Google AdSense</span>
          <strong>Multiplex / Responsive</strong>
        </div>
      </section>
      <section class="ad-banner footer-ad" aria-label="مساحة اعلانية سفلية">
        <span>مساحة اعلان Google AdSense</span>
        <strong>Footer Responsive Ad</strong>
      </section>
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
      const workerUrl = new URL("sw.js", baseUrl);
      const scopeUrl = new URL("./", baseUrl);
      navigator.serviceWorker.register(workerUrl, { scope: scopeUrl.pathname }).catch(() => {});
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
