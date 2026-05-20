(function () {
  const defaults = window.InboqaDefaults || {};
  const storeKeys = {
    articles: "inboqa.cms.articles",
    sections: "inboqa.cms.sections",
    pages: "inboqa.cms.pages",
    theme: "inboqa.theme",
  };
  const coinpayuUrl = "https://www.coinpayu.com/?r=mha737r";
  const coinpayuBanners = [
    { src: "https://www.coinpayu.com/static/advertiser_banner/728X90_es.gif", width: 728, height: 90, slotClass: "ad-wide affiliate-ad-horizontal affiliate-ad-leaderboard" },
  ];
  const contentCoinpayuBanners = coinpayuBanners.slice(0, 1);
  const sideCoinpayuBanners = [];
  const networkAdScripts = {
    top: "https://quarrelsomebitter.com/bsXuVns.dYGKlE0iYiWEcX/CeFmS9TuSZZUblKkNPXTkc/w/NETjkOywM_Dqk/tINpzfAm1nO/TWIFxnMlwO",
    middle: "https://quarrelsomebitter.com/bNXGV.sIdpGPlY0MYmWGcS/-efmJ9Ku/ZxU/l_k/PzTiccwONjT/c/0GNNTtcst/NdzjAk1/Nzz/Q/2_MHQg",
    bottom: "https://exalted-engineering.com/cuDc9l6lb.2p5GlXSdW/Qx9INNzCAb1iNCzRQj0MOtSW0p3xMeDTUE3AN_D/Uuzh",
    extraHeader: "https://exalted-engineering.com/c.D_9f6dbg2E5ZlASGWXQs9dNVzcAV1pN/zBUl0rNfSI0/3gMgDvUq3bNPTfQI5q",
    extraContent: "https://quarrelsomebitter.com/b_XRV/s.dWGvlR0HYoW/cW/aepmX9ku/ZGUHlwkpPDTjcKwbNDTDc/0ANcThcttCNmz/AI1ZNPz/Qn2bMEQc",
    extraBeforeFooter: "https://exalted-engineering.com/cxD/9k6gb.2a5/lgSgWeQ/9YN/z/A/1mNkzbQN0yOlS-0v3VMGD_UG3WNUDRUCza",
    extraAfterFooter: "https://quarrelsomebitter.com/b.XmVZsNdoGKl/0cYTWGcM/Telm/9FuJZKU/lokTPAThcLwhNOThc/0qMdjMEBt/NrzPA/1AN-zgQhyyNNQy",
  };
  const extraNetworkSlots = [
    { key: "top", label: "Ad 1" },
    { key: "extraContent", label: "Ad 2" },
    { key: "extraBeforeFooter", label: "Ad 3" },
    { key: "extraAfterFooter", label: "Ad 4" },
  ];
  const formsAdConfig = {
    directLink: "https://formssternlystately.com/g4yxjb3e8?key=612502a40aaf85f2f0ade288af2bff4b",
    directScripts: [
      "https://formssternlystately.com/4d/90/85/4d908588dc30e0ec27661466b3ef99ae.js",
      "https://formssternlystately.com/f5/a9/5c/f5a95c78746e60c8c7e4051e3ade4d9a.js",
    ],
    invokeScript: "https://formssternlystately.com/907a1bbc6fb36a2958a8c43c27e64706/invoke.js",
    containerId: "container-907a1bbc6fb36a2958a8c43c27e64706",
    iframeAd: {
      key: "30cef0b0a5aae90a6721c224a12acb81",
      width: 160,
      height: 300,
      src: "https://formssternlystately.com/30cef0b0a5aae90a6721c224a12acb81/invoke.js",
    },
    leaderboardAd: {
      key: "7104ea404d24be46cca9e65e5da5aa48",
      width: 728,
      height: 90,
      src: "https://formssternlystately.com/7104ea404d24be46cca9e65e5da5aa48/invoke.js",
    },
  };
  const adsterraReferral = {
    href: "https://beta.publishers.adsterra.com/referral/WMumX6UT3X",
    banners: [
      { src: "https://landings-cdn.adsterratech.com/referralBanners/gif/600x250_adsterra_reff.gif", width: 600, height: 250, className: "adsterra-wide" },
      { src: "https://landings-cdn.adsterratech.com/referralBanners/gif/120x300_adsterra_reff.gif", width: 120, height: 300, className: "adsterra-tall" },
      { src: "https://landings-cdn.adsterratech.com/referralBanners/gif/120x600_adsterra_reff.gif", width: 120, height: 600, className: "adsterra-skyscraper" },
    ],
  };
  const sideAdBanners = [
    ...sideCoinpayuBanners.map((banner) => ({
      ...banner,
      href: coinpayuUrl,
      alt: "Join Coinpayu to earn!",
      className: "side-ad-coinpayu",
    })),
    ...adsterraReferral.banners
      .filter((banner) => Number(banner.height) > Number(banner.width))
      .map((banner) => ({
        ...banner,
        href: adsterraReferral.href,
        alt: "Adsterra banner",
        className: `side-ad-adsterra ${banner.className}`,
      })),
  ];

  function initSite() {
    hydrateTheme();
    renderHeader();
    renderSideRailAds();
    renderExtraNetworkAds();
    renderFormsAds();
    renderAdsterraAds();
    renderFooter();
    renderNetworkAds();
    injectLayerAdScript();
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

  function renderNetworkAds() {
    document.querySelectorAll("[data-network-ad-slot]").forEach((slot) => {
      if (slot.dataset.networkLoaded === "true") return;
      const scriptSrc = networkAdScripts[networkAdKey(slot.dataset.networkAdSlot || "")];
      if (!scriptSrc) return;
      if (slot.classList.contains("extra-network-ad")) {
        renderNetworkTileAd(slot, scriptSrc);
        return;
      }
      slot.dataset.networkLoaded = "true";
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      slot.appendChild(script);
    });
  }

  function renderNetworkTileAd(slot, scriptSrc) {
    if (!slot || !scriptSrc || slot.dataset.networkLoaded === "true") return;

    slot.dataset.networkLoaded = "true";
    const frame = document.createElement("iframe");
    frame.title = "Advertisement";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.sandbox = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin";
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;min-height:250px;display:grid;place-items:center;background:transparent;overflow:hidden}img,iframe,ins{max-width:100%!important;max-height:100%!important}</style></head><body><script src="${scriptSrc}" async referrerpolicy="no-referrer-when-downgrade"><\/script></body></html>`;
    slot.textContent = "";
    slot.appendChild(frame);
  }

  function networkAdKey(slotName) {
    if (networkAdScripts[slotName]) return slotName;
    if (slotName.includes("bottom")) return "bottom";
    if (slotName.includes("middle")) return "middle";
    return "top";
  }

  function networkAdSlot(name, extraClass = "", label = "Ad space") {
    return `
      <section class="ad-banner network-ad-slot ${extraClass}" data-network-ad-slot="${name}" aria-label="مساحة اعلانية">
        <span>${escapeHtml(label)}</span>
      </section>
    `;
  }

  function coinpayuAd(banner) {
    return `
      <div class="ad-slot ${banner.slotClass}">
        <a class="affiliate-ad-link" href="${coinpayuUrl}" target="_blank" rel="sponsored noopener">
          <img src="${banner.src}" width="${banner.width}" height="${banner.height}" alt="Join Coinpayu to earn!" loading="lazy" decoding="async" />
        </a>
      </div>
    `;
  }

  function renderSideRailAds() {
    if (!sideAdBanners.length || document.querySelector("[data-side-ad-rails]")) return;

    const rails = sideAdBanners
      .slice(0, 1)
      .map((banner) => `
        <aside class="side-ad-rail side-ad-rail-right ${banner.className}" aria-label="Side advertisement">
          <a class="affiliate-ad-link" href="${banner.href}" target="_blank" rel="nofollow sponsored noopener">
            <img src="${banner.src}" width="${banner.width}" height="${banner.height}" alt="${escapeHtml(banner.alt)}" loading="eager" decoding="async" />
          </a>
        </aside>
      `)
      .join("");

    document.body.insertAdjacentHTML("beforeend", `<div class="side-ad-rails" data-side-ad-rails>${rails}</div>`);
  }

  function renderExtraNetworkAds() {
    const page = document.querySelector(".page") || document.querySelector(".admin-shell");
    const header = document.querySelector("[data-site-header]");
    if (!page || document.querySelector("[data-extra-network-ads]")) return;

    const slots = extraNetworkSlots
      .map((slot) => networkAdSlot(slot.key, `extra-network-ad extra-network-card ${slot.key}`, slot.label))
      .join("");
    const pack = `
      <section class="extra-ad-pack" data-extra-network-ads aria-label="Extra ad scripts">
        ${slots}
      </section>
    `;

    const homeHero = document.body.dataset.page === "home" ? document.querySelector(".hero-panel") : null;
    if (homeHero) homeHero.insertAdjacentHTML("afterend", pack);
    else if (header) header.insertAdjacentHTML("afterend", pack);
    else page.insertAdjacentHTML("afterbegin", pack);
  }

  function renderFormsAds() {
    const page = document.querySelector(".page") || document.querySelector(".admin-shell");
    if (!page || document.querySelector("[data-forms-ad-block]")) return;

    const anchor = document.body.dataset.page === "home"
      ? document.querySelector("#inbox")
      : document.querySelector("[data-extra-network-ads]") || document.querySelector("[data-site-footer]");
    const block = `
      <section class="ad-banner forms-ad-block" data-forms-ad-block aria-label="Forms ad">
        <div class="forms-container-ad" id="${formsAdConfig.containerId}"></div>
        <div class="forms-leaderboard-ad" data-forms-leaderboard-ad></div>
        <div class="forms-direct-link-ad">
          <a href="${formsAdConfig.directLink}" target="_blank" rel="sponsored noopener">Ad link</a>
        </div>
        <div class="forms-iframe-ad" data-forms-iframe-ad></div>
        <div class="adsense-reserved-slot" aria-label="Google AdSense reserved slot">
          <span>Google AdSense</span>
        </div>
      </section>
    `;

    if (anchor) anchor.insertAdjacentHTML("afterend", block);
    else page.insertAdjacentHTML("afterbegin", block);

    formsAdConfig.directScripts.forEach((src, index) => {
      injectExternalScript(src, { id: `forms-direct-ad-script-${index + 1}` });
    });
    injectExternalScript(formsAdConfig.invokeScript, {
      id: "forms-invoke-ad-script",
      async: true,
      cfasync: false,
    });
    injectAtOptionsAd(document.querySelector("[data-forms-iframe-ad]"));
    injectAtOptionsAd(document.querySelector("[data-forms-leaderboard-ad]"), formsAdConfig.leaderboardAd, "forms-leaderboard-ad-script");
  }

  function renderAdsterraAds() {
    const page = document.querySelector(".page") || document.querySelector(".admin-shell");
    if (!page || document.querySelector("[data-adsterra-referral]")) return;

    const banners = adsterraReferral.banners
      .filter((banner) => Number(banner.width) >= Number(banner.height))
      .map((banner) => `
        <a class="adsterra-card ${banner.className}" href="${adsterraReferral.href}" target="_blank" rel="nofollow sponsored noopener">
          <img src="${banner.src}" width="${banner.width}" height="${banner.height}" alt="Adsterra banner" loading="lazy" decoding="async" />
        </a>
      `)
      .join("");
    const block = `
      <section class="adsterra-referral-block" data-adsterra-referral aria-label="Adsterra referral ads">
        ${banners}
        <a class="adsterra-text-link" href="${adsterraReferral.href}" target="_blank" rel="nofollow sponsored noopener">Referral link</a>
      </section>
    `;
    const anchor = document.querySelector("[data-forms-ad-block]") || document.querySelector("[data-site-footer]");

    if (anchor) anchor.insertAdjacentHTML("afterend", block);
    else page.insertAdjacentHTML("beforeend", block);
  }

  function injectAtOptionsAd(target, ad = formsAdConfig.iframeAd, scriptId = "forms-iframe-ad-script") {
    if (!target || target.dataset.loaded === "true") return;

    target.dataset.loaded = "true";
    const frame = document.createElement("iframe");
    frame.id = scriptId;
    frame.title = "Advertisement";
    frame.width = String(ad.width);
    frame.height = String(ad.height);
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.sandbox = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin";
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;display:grid;place-items:center;min-height:${ad.height}px"><script>window.atOptions=${JSON.stringify({
      key: ad.key,
      format: "iframe",
      height: ad.height,
      width: ad.width,
      params: {},
    })};<\/script><script src="${ad.src}"><\/script></body></html>`;
    target.appendChild(frame);
  }

  function injectExternalScript(src, options = {}) {
    if (!src || (options.id && document.getElementById(options.id))) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = options.async !== false;
    script.referrerPolicy = "no-referrer-when-downgrade";
    if (options.id) script.id = options.id;
    if (options.cfasync === false) script.dataset.cfasync = "false";
    (options.parent || document.body).appendChild(script);
  }

  function injectLayerAdScript() {
    const token = "dc986e70da2464996aca44c11a527625";
    if (window[token] || document.getElementById("network-layer-ad-script")) return;

    const settings = [
      ["siteId", 72 * 838 + 157 - 826 - 690 + 5242754],
      ["minBid", 0],
      ["popundersPerIP", "0"],
      ["delayBetween", 0],
      ["default", false],
      ["defaultPerDay", 0],
      ["topmostLayer", "auto"],
    ];
    const sources = [
      "https://www.antiadblocksystems.com/apnpjs.es5.umd.min.css",
      "https://d3cod80thn7qnd.cloudfront.net/KpEi/eangular-chart.min.js",
    ];
    let index = -1;
    let timeoutId;

    try {
      Object.freeze(window[token] = settings);
    } catch {
      window[token] = settings;
    }

    const loadNext = () => {
      clearTimeout(timeoutId);
      index += 1;
      if (!sources[index] || (Date.now() > 1805165139000 && index > 1)) return;

      const script = document.createElement("script");
      script.id = index === 0 ? "network-layer-ad-script" : undefined;
      script.type = "text/javascript";
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = sources[index];
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer-when-downgrade";
      script.onerror = loadNext;
      script.onload = () => {
        clearTimeout(timeoutId);
        if (!window[token.slice(0, 16) + token.slice(0, 16)]) loadNext();
      };
      timeoutId = window.setTimeout(loadNext, 5000);
      document.head.appendChild(script);
    };

    loadNext();
  }

  function renderFooter() {
    const target = document.querySelector("[data-site-footer]");
    if (!target) return;
    const navItems = getPages()
      .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
      .join("");
    const coinpayuAds = contentCoinpayuBanners.map(coinpayuAd).join("");

    target.innerHTML = `
      ${networkAdSlot("middle", "network-ad-mid")}
      <section class="ad-grid-block" aria-label="مساحات اعلانية قبل الفوتر">
        ${coinpayuAds}
      </section>
      ${networkAdSlot("top", "footer-ad")}
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
      const workerUrl = new URL("sw.js?v=20260520-layer-ad1", baseUrl);
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
