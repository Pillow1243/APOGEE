/* APOGEE / اوج — ساخته شده توسط مبین.آ */
(() => {
  const $ = (id) => document.getElementById(id);
  const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  const JMONTHS = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];

  const ISO2 = {
    USA: "US", NZL: "NZ", JPN: "JP", CHN: "CN", KAZ: "KZ", IND: "IN",
    FRA: "FR", GUF: "GF", RUS: "RU", AUS: "AU", KOR: "KR", ISR: "IL",
    IRN: "IR", ARE: "AE", GBR: "GB", ITA: "IT", BRA: "BR", CAN: "CA",
    ARG: "AR", NOR: "NO", SWE: "SE", DEU: "DE", ESP: "ES", UKR: "UA",
    NLD: "NL", MEX: "MX", ZAF: "ZA", TUR: "TR", SAU: "SA", IDN: "ID",
  };

  const COUNTRY_FA = {
    USA: "آمریکا", NZL: "نیوزیلند", JPN: "ژاپن", CHN: "چین", KAZ: "قزاقستان",
    IND: "هند", FRA: "فرانسه", GUF: "گویانا فرانسه", RUS: "روسیه", AUS: "استرالیا",
    KOR: "کره جنوبی", ISR: "اسرائیل", IRN: "ایران", ARE: "امارات", GBR: "بریتانیا",
    ITA: "ایتالیا", BRA: "برزیل", CAN: "کانادا", ARG: "آرژانتین", DEU: "آلمان",
  };

  const WMO = {
    0: "آسمان صاف", 1: "اغلب صاف", 2: "نیمه‌ابری", 3: "ابری",
    45: "مه", 48: "مه یخی", 51: "نم‌نم", 53: "باران ریز",
    55: "باران ریز شدید", 61: "باران ملایم", 63: "باران", 65: "باران شدید",
    71: "برف ملایم", 73: "برف", 75: "برف شدید", 80: "رگبار",
    81: "رگبار شدید", 95: "رعدوبرق", 96: "توفان تگرگی", 99: "توفان شدید",
  };

  const STATUS = {
    1: { name: "آماده", cls: "go" },
    2: { name: "نامشخص", cls: "tbd" },
    3: { name: "موفق", cls: "success" },
    4: { name: "ناموفق", cls: "failure" },
    5: { name: "توقف", cls: "hold" },
    6: { name: "در پرواز", cls: "in-flight" },
    7: { name: "نیمه‌موفق", cls: "partial-failure" },
    8: { name: "در انتظار تأیید", cls: "tbc" },
  };

  const ORBIT_FA = {
    LEO: "مدار پایین زمین",
    MEO: "مدار میانی",
    GEO: "مدار زمین‌ثابت",
    GTO: "انتقال زمین‌ثابت",
    SSO: "مدار خورشیدآهنگ",
    HEO: "مدار بیضوی بالا",
    "Sub-orbital": "زیرمداری",
    "Low Earth Orbit": "مدار پایین زمین",
    "Geostationary Transfer Orbit": "انتقال زمین‌ثابت",
    "Sun-Synchronous Orbit": "مدار خورشیدآهنگ",
  };

  const TYPE_FA = {
    "Earth Science": "علوم زمین",
    Communications: "مخابرات",
    Navigation: "ناوبری",
    "Human Exploration": "اکتشاف سرنشین‌دار",
    "Robotics": "رباتیک",
    "Planetary Science": "علوم سیاره‌ای",
    Astrophysics: "اخترفیزیک",
    "Test Flight": "پرواز آزمایشی",
    Dedicated: "اختصاصی",
    Rideshare: "هم‌سفر",
    "Government/Top Secret": "دولتی",
    Tourism: "گردشگری فضایی",
    Resupply: "تدارکات",
    Crewed: "سرنشین‌دار",
  };

  const STATION_FA = {
    "International Space Station": "ایستگاه بین‌المللی",
    "Tiangong space station": "تیان‌گونگ",
    ISS: "ایستگاه بین‌المللی",
    Tiangong: "تیان‌گونگ",
  };

  const ROLE_FA = {
    Commander: "فرمانده",
    "Flight Engineer": "مهندس پرواز",
    Pilot: "خلبان",
    Operator: "اپراتور",
    "Mission Specialist": "متخصص ماموریت",
    "Spaceflight Participant": "شرکت‌کننده",
  };

  const VIS_FA = {
    daylight: "روز",
    eclipsed: "سایهٔ زمین",
    visible: "قابل‌رؤیت",
  };
  const VIS_EN = {
    daylight: "daylight",
    eclipsed: "eclipsed",
    visible: "visible",
  };
  const WMO_EN = {
    0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle",
    55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Showers",
    81: "Heavy showers", 95: "Thunderstorm", 96: "Storm + hail", 99: "Severe storm",
  };

  const state = {
    tab: "upcoming",
    filter: "all",
    q: "",
    upcoming: [],
    previous: [],
    selected: null,
    iss: null,
    issPath: [],
    crew: [],
    globe: null,
    flat: false,
    spinning: true,
    lang: localStorage.getItem("apogee-lang") || "en",
    satFilter: "all",
    sats: [],
    events: [],
    news: [],
    spaceWx: null,
    apod: null,
    passes: [],
    observer: null,
    theme: localStorage.getItem("apogee-theme") || "dark",
    favs: [],
  };

  function dict() {
    return (window.I18N && window.I18N[state.lang]) || window.I18N.fa;
  }
  function t(key, ...args) {
    const v = dict()[key];
    if (typeof v === "function") return v(...args);
    return v || key;
  }
  function applyI18n() {
    const d = dict();
    document.documentElement.lang = d.htmlLang;
    document.documentElement.dir = d.dir;
    document.title = d.title;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = d[el.dataset.i18n];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = d[el.dataset.i18nPlaceholder] || "";
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = d[el.dataset.i18nTitle] || "";
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      el.alt = d[el.dataset.i18nAlt] || "";
    });
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.classList.toggle("on", b.dataset.lang === state.lang);
    });
    if (typeof syncTabChrome === "function") syncTabChrome();
    if (typeof renderLive === "function") renderLive();
    if (typeof renderSpaceWx === "function") renderSpaceWx();
    if (typeof renderSky === "function") renderSky();
    if (typeof renderApod === "function") renderApod();
    if (typeof renderNews === "function") renderNews();
  }
  function setLang(lang) {
    state.lang = lang === "en" ? "en" : "fa";
    localStorage.setItem("apogee-lang", state.lang);
    applyI18n();
    renderList();
    renderCrew();
    renderStats();
    if (state.selected) {
      renderMission();
      loadWeather(padOf(state.selected));
    } else if ($("mission-desc")) {
      $("mission-desc").textContent = t("pickLaunch");
      $("status-pill").textContent = t("standby");
    }
    stampFresh();
    if (!state.iss) $("iss-coords").textContent = t("issLock");
    else if ($("stat-vis") && state.sats && state.sats.length) $("stat-vis").textContent = fa(state.sats.length);
    if (typeof applyTheme === "function") applyTheme();
    if (typeof syncFavBtn === "function") syncFavBtn();
  }

  function fa(n) {
    const s = String(n);
    if (state.lang !== "fa") return s;
    return s.replace(/\d/g, (d) => FA_DIGITS[d]);
  }

  function toJalali(gy, gm, gd) {
    const g_d_n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days =
      355666 +
      365 * gy +
      Math.floor((gy2 + 3) / 4) -
      Math.floor((gy2 + 99) / 100) +
      Math.floor((gy2 + 399) / 400) +
      gd +
      g_d_n[gm - 1];
    let jy = -1595 + 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
    return [jy, jm, jd];
  }

  function whenLine(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    if (state.lang !== "fa") {
      return (
        d.toLocaleString("en-GB", {
          timeZone: "Asia/Tehran",
          dateStyle: "medium",
          timeStyle: "short",
        }) + " Tehran"
      );
    }
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(d);
    const get = (tp) => parts.find((p) => p.type === tp)?.value;
    const [jy, jm, jd] = toJalali(+get("year"), +get("month"), +get("day"));
    return `${fa(jd)} ${JMONTHS[jm - 1]} ${fa(jy)}، ساعت ${fa(get("hour"))}:${fa(get("minute"))} به وقت تهران`;
  }

  const padKey = (pad) =>
    pad ? `${pad.id || ""}:${(+pad.latitude).toFixed(3)},${(+pad.longitude).toFixed(3)}` : "";

  function imgOf(image) {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.image_url || image.thumbnail_url || "";
  }

  function statusOf(launch) {
    const s = launch?.status || {};
    const pack = (dict().status || {})[s.id];
    return pack || STATUS[s.id] || { name: s.name || t("unnamed"), cls: "tbd" };
  }

  function flag(cc) {
    const a = ISO2[(cc || "").toUpperCase()];
    if (!a) return "";
    return [...a].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0))).join("");
  }

  function shortLoc(pad) {
    if (!pad) return t("unknownPad");
    const cc = pad.country_code;
    const nation = COUNTRY_FA[cc] || "";
    const loc = pad.location?.name || pad.name || "";
    const parts = loc.split(",").map((s) => s.trim());
    const last = parts[parts.length - 1] || pad.name;
    return nation ? `${last} · ${nation}` : last;
  }

  function missionName(l) {
    const n = l.name || "";
    const pipe = n.split("|");
    return (pipe[1] || pipe[0] || t("unnamed")).trim();
  }

  function vehicleName(l) {
    return (
      l.rocket?.configuration?.full_name ||
      l.rocket?.configuration?.name ||
      (l.name || "").split("|")[0].trim() ||
      t("vehicleFallback")
    );
  }

  function agencyOf(l) {
    return l.launch_service_provider || l.lsp || {};
  }

  function padOf(l) {
    return l.pad || {};
  }

  function relTime(net) {
    const s = (new Date(net).getTime() - Date.now()) / 1000;
    const abs = Math.abs(s);
    if (abs < 90) return t("relNow");
    if (abs < 3600) {
      const m = Math.round(abs / 60);
      return t("relMin", fa(m), s >= 0);
    }
    if (abs < 86400) {
      const h = Math.floor(abs / 3600);
      const m = Math.round((abs % 3600) / 60);
      return t("relHour", fa(h), fa(m), s >= 0);
    }
    const d = Math.floor(abs / 86400);
    const h = Math.floor((abs % 86400) / 3600);
    return t("relDay", fa(d), fa(h), s >= 0);
  }

  function pad2(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, "0");
  }

  function escapeAttr(s) {
    return String(s || "").replace(/['"<>]/g, "");
  }

  function safeParse(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  async function getJSON(url) {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    try {
      const res = await fetch(url, ctrl ? { signal: ctrl.signal } : {});
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async function loadLaunches() {
    const tryUrls = [
      "/api/upcoming",
      "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=20&mode=detailed",
      "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=20",
    ];
    for (const u of tryUrls) {
      try {
        const data = await getJSON(u);
        const list = data.results || data || [];
        if (Array.isArray(list) && list.length) {
          state.upcoming = list;
          return;
        }
      } catch (_) { /* next */ }
    }
    throw new Error(t("rangeDown"));
  }

  async function loadPrevious() {
    try {
      const data = await getJSON("/api/previous");
      state.previous = data.results || [];
    } catch (_) {
      try {
        const data = await getJSON("https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=12");
        state.previous = data.results || [];
      } catch (__) {
        state.previous = [];
      }
    }
  }

  async function loadCrew() {
    let data = null;
    try {
      data = await getJSON("/api/stations");
    } catch (_) {
      data = null;
    }
    if (!data || !Array.isArray(data.stations)) {
      const urls = [
        [
          "https://ll.thespacedevs.com/2.2.0/spacestation/4/",
          "https://lldev.thespacedevs.com/2.2.0/spacestation/4/",
        ],
        [
          "https://ll.thespacedevs.com/2.2.0/spacestation/18/",
          "https://lldev.thespacedevs.com/2.2.0/spacestation/18/",
        ],
      ];
      const stations = [];
      for (const pair of urls) {
        let st = null;
        for (const u of pair) {
          try {
            st = await getJSON(u);
            break;
          } catch (_) { /* next */ }
        }
        if (st) stations.push(st);
      }
      data = { stations };
    }
    const crew = [];
    for (const st of data.stations || []) {
      for (const exp of st.active_expeditions || []) {
        for (const c of exp.crew || []) {
          const a = c.astronaut || {};
          if (!a.name || /starman/i.test(a.name) || a.nationality === "Earthling") continue;
          crew.push({
            name: a.name,
            station: st.name || "",
            roleKey: c.role?.role || "",
            expedition: exp.name || "",
            img: a.profile_image_thumbnail || a.profile_image || "",
          });
        }
      }
    }
    state.crew = crew;
  }

  function hasSatLib() {
    return typeof satellite === "object" && typeof satellite.json2satrec === "function";
  }

  async function loadCatalog() {
    const data = await getJSON("./data/satellites.json");
    if (!hasSatLib()) throw new Error("satellite.js missing");
    const list = [];
    for (const row of data.sats || []) {
      try {
        const rec = satellite.twoline2satrec(row.l1, row.l2);
        if (!rec) continue;
        list.push({
          id: row.id,
          name: row.name || String(row.id),
          group: row.group || "new",
          epoch: null,
          satrec: rec,
          lat: null,
          lng: null,
          alt: null,
          vel: null,
        });
      } catch (_) { /* skip bad element */ }
    }
    state.sats = list;
    state.catalogUpdated = data.updated || null;
    if (state.trackedId == null) {
      const iss = list.find((s) => /ISS/i.test(s.name) && /ZARYA/i.test(s.name)) || list[0];
      if (iss) state.trackedId = iss.id;
    }
  }

  function visibleSats() {
    let list = state.sats;
    if (state.satFilter === "stations" || state.satFilter === "new") {
      list = list.filter((s) => s.group === state.satFilter);
    }
    const q = state.q.trim().toLowerCase();
    if (q) list = list.filter((s) => `${s.name} ${s.id}`.toLowerCase().includes(q));
    return list;
  }

  function trackedSat() {
    return state.sats.find((s) => s.id === state.trackedId) || null;
  }

  function tickSats() {
    if (!hasSatLib() || !state.sats.length) return;
    const now = new Date();
    const gmst = satellite.gstime(now);
    for (const s of state.sats) {
      try {
        const pv = satellite.propagate(s.satrec, now);
        if (!pv || !pv.position) continue;
        const geo = satellite.eciToGeodetic(pv.position, gmst);
        s.lat = satellite.radiansToDegrees(geo.latitude);
        s.lng = satellite.radiansToDegrees(geo.longitude);
        s.alt = geo.height;
        if (pv.velocity) {
          const v = pv.velocity;
          s.vel = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) * 3600;
        }
      } catch (_) { /* skip */ }
    }
    const tr = trackedSat();
    if (tr && tr.lat != null) {
      $("track-name").textContent = tr.name.replace(/\s*\(.*\)\s*$/, "") || tr.name;
      $("iss-coords").textContent =
        `${tr.lat.toFixed(2)}°  ${tr.lng.toFixed(2)}°  ·  ${Math.round(tr.alt)} km` +
        (tr.vel ? `  ·  ${Math.round(tr.vel)} km/h` : "");
    }
    if ($("stat-vis")) $("stat-vis").textContent = fa(state.sats.length);
    applyGlobeData();
    renderFlat();
    if (state.tab === "orbit") renderSatList();
  }

  function renderSatList() {
    const list = visibleSats();
    $("list-count").textContent = fa(list.length);
    if (!list.length) {
      $("launch-list").innerHTML = `<div class="card muted" style="padding:14px">${t("empty")}</div>`;
      return;
    }
    $("launch-list").innerHTML = list
      .map((s) => {
        const on = s.id === state.trackedId ? "on" : "";
        const alt = s.alt != null ? `${Math.round(s.alt)} km` : "—";
        return `<button class="sat-item ${on}" data-sat-id="${s.id}" type="button">
          <span class="sat-dot ${s.group}"></span>
          <div class="title" dir="ltr">${escapeAttr(s.name)}</div>
          <div class="sat-meta" dir="ltr">${alt}</div>
        </button>`;
      })
      .join("");
  }

  function syncTabChrome() {
    const orbit = state.tab === "orbit";
    const events = state.tab === "events";
    const lf = $("filters");
    const sf = $("sat-filters");
    if (lf) lf.hidden = orbit || events;
    if (sf) sf.hidden = !orbit;
    const search = $("search");
    if (search) search.placeholder = t(orbit ? "satSearch" : "search");
  }

  function flySat(sat) {
    if (!sat || sat.lat == null || !state.globe) return;
    state.globe.controls().autoRotate = false;
    state.spinning = false;
    $("spin-btn").classList.remove("on");
    state.globe.pointOfView({ lat: sat.lat, lng: sat.lng, altitude: 1.35 }, 900);
  }

  function stampFresh() {
    const t = new Date().toLocaleTimeString(state.lang === "fa" ? "fa-IR" : "en-GB", {
      timeZone: "Asia/Tehran",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const el = $("freshness");
    if (el) el.textContent = dict().fresh(t);
  }

  function visibleList() {
    let list = state.tab === "upcoming" ? state.upcoming.slice() : state.previous.slice();
    const q = state.q.trim().toLowerCase();
    if (q) {
      list = list.filter((l) => {
        const blob = `${l.name} ${vehicleName(l)} ${agencyOf(l).name || ""} ${padOf(l).name || ""}`.toLowerCase();
        return blob.includes(q);
      });
    }
    if (state.filter === "fav") {
      const ids = new Set((state.favs || []).map((f) => String(f.id)));
      list = list.filter((l) => ids.has(String(l.id)));
    }
    if (state.filter === "crew") {
      list = list.filter((l) =>
        /crew|human|starliner|soyuz|shenzhou|dragon|taikonaut|astronaut/i.test(
          `${l.name || ""} ${l.mission?.type || ""} ${l.mission?.name || ""}`
        )
      );
    }
    if (state.filter === "go") list = list.filter((l) => l.status?.id === 1);
    if (state.filter === "day") {
      const now = Date.now();
      list = list.filter((l) => {
        const t = new Date(l.net).getTime();
        return t > now - 36e5 && t < now + 864e5;
      });
    }
    return list;
  }

  function renderStats() {
    const now = Date.now();
    const n24 = state.upcoming.filter((l) => {
      const t = new Date(l.net).getTime();
      return t > now && t < now + 864e5;
    }).length;
    $("stat-24h").textContent = t("stat24v", fa(n24));
    $("stat-crew").textContent = t("statCrewV", fa(state.crew.length));
    if ($("stat-vis")) $("stat-vis").textContent = fa(state.sats.length || "—");
  }

  function renderList() {
    if (state.tab === "orbit") {
      renderSatList();
      return;
    }
    const list = visibleList();
    $("list-count").textContent = fa(list.length);
    if (!list.length) {
      $("launch-list").innerHTML = `<div class="card muted" style="padding:14px">${t("empty")}</div>`;
      return;
    }
    $("launch-list").innerHTML = list
      .map((l) => {
        const st = statusOf(l);
        const on = state.selected && state.selected.id === l.id ? "on" : "";
        const img = imgOf(l.image);
        return `<button class="launch-item ${on}" data-id="${l.id}" type="button">
          <div class="thumb" style="background-image:${img ? `url('${escapeAttr(img)}')` : "none"}"></div>
          <div class="body">
            <div class="row">
              <span class="st ${st.cls}">${st.name}</span>
              <span class="when">${relTime(l.net)}</span>
            </div>
            <div class="title" dir="ltr">${missionName(l)}</div>
            <div class="sub" dir="ltr">${vehicleName(l)} · ${shortLoc(padOf(l))}</div>
          </div>
        </button>`;
      })
      .join("");
  }

  function renderCrew() {
    const el = $("crew-body");
    if (!state.crew.length) {
      el.innerHTML = `<div class="muted">${t("noCrew")}</div>`;
      return;
    }
    el.innerHTML = state.crew
      .slice(0, 12)
      .map((p) => {
        const craft =
          state.lang === "fa"
            ? STATION_FA[p.station] || p.station
            : p.station === "International Space Station"
              ? "ISS"
              : p.station === "Tiangong space station"
                ? "Tiangong"
                : p.station;
        const role = state.lang === "fa" ? ROLE_FA[p.roleKey] || p.roleKey : p.roleKey;
        return `<div class="person">
          ${p.img ? `<img class="ava" src="${escapeAttr(p.img)}" alt="">` : `<div class="ava"></div>`}
          <div>
            <div class="nm" dir="ltr">${p.name}</div>
            <div class="cr">${[role, craft].filter(Boolean).join(" · ")}</div>
          </div>
        </div>`;
      })
      .join("");
  }

  function renderMission() {
    const l = state.selected;
    if (!l) return;
    const mission = l.mission || {};
    const agency = agencyOf(l);
    const pad = padOf(l);
    const st = statusOf(l);
    const img = imgOf(l.image);
    $("hero-photo").style.backgroundImage = img ? `url('${escapeAttr(img)}')` : "none";
    $("mission-name").textContent = missionName(l);
    $("mission-desc").textContent =
      mission.description || l.mission_description || t("noDesc");

    const chips = [];
    if (mission.type) {
      chips.push(state.lang === "fa" ? TYPE_FA[mission.type] || mission.type : mission.type);
    }
    const orbitName = mission.orbit?.abbrev || mission.orbit?.name;
    if (orbitName) {
      chips.push(
        state.lang === "fa"
          ? ORBIT_FA[orbitName] || ORBIT_FA[mission.orbit?.name] || orbitName
          : mission.orbit?.name || orbitName
      );
    }
    if (agency.abbrev || agency.name) chips.push(agency.abbrev || agency.name);
    $("mission-chips").innerHTML = chips.map((c) => `<span class="chip">${c}</span>`).join("");

    const p = typeof l.probability === "number" ? l.probability : -1;
    if (p >= 0) {
      $("prob-wrap").hidden = false;
      $("prob-val").textContent = `${fa(p)}٪`;
      $("prob-bar").style.width = `${Math.min(100, p)}%`;
    } else {
      $("prob-wrap").hidden = true;
    }

    $("when-line").textContent = whenLine(l.net);

    $("vehicle-name").textContent = vehicleName(l);
    $("agency-name").textContent = agency.name || "";
    const ok = agency.successful_launches;
    const total = agency.total_launch_count;
    $("agency-stats").textContent =
      total != null ? t("agencyStats", fa(ok ?? "—"), fa(total)) : "";

    const logo = agency.logo_url;
    const logoEl = $("agency-logo");
    if (logo) {
      logoEl.src = logo;
      logoEl.hidden = false;
    } else logoEl.hidden = true;

    $("status-pill").textContent = st.name;
    $("status-pill").className = `pill ${st.cls}`;
    const fl = flag(pad.country_code);
    const nation = COUNTRY_FA[pad.country_code] || "";
    $("pad-line").textContent = `${fl ? fl + " " : ""}${pad.name || "پد"} — ${nation || shortLoc(pad)}`;

    const map = pad.map_image;
    if (map) {
      $("pad-card").hidden = false;
      $("pad-map").src = map;
    } else {
      $("pad-card").hidden = true;
    }

    const vids = l.vidURLs || l.vid_urls || [];
    const web =
      vids.find((v) => /youtube|webcast|official/i.test(`${v.url} ${v.type?.name || ""}`)) || vids[0];
    const btn = $("webcast-btn");
    if (web?.url) {
      btn.href = web.url;
      btn.hidden = false;
    } else btn.hidden = true;
  }

  function tickCountdown() {
    const l = state.selected;
    if (!l) return;
    const t = new Date(l.net).getTime() - Date.now();
    const past = t < 0;
    $("t-prefix").textContent = past ? "T +" : "T −";
    const abs = Math.abs(t);
    const d = Math.floor(abs / 86400000);
    const h = Math.floor((abs % 86400000) / 3600000);
    const m = Math.floor((abs % 3600000) / 60000);
    const s = Math.floor((abs % 60000) / 1000);
    const nums = $("countdown").querySelectorAll(".num");
    nums[0].textContent = pad2(d);
    nums[1].textContent = pad2(h);
    nums[2].textContent = pad2(m);
    nums[3].textContent = pad2(s);
  }

  function tickClocks() {
    const now = new Date();
    $("utc-clock").textContent = now.toISOString().slice(11, 19);
    $("tehran-clock").textContent = now.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Tehran",
      hour12: false,
    });
  }

  function weatherCall(c) {
    const code = c.weather_code;
    const wind = c.wind_speed_10m || 0;
    const gust = c.wind_gusts_10m || 0;
    if ([95, 96, 99, 65, 75].includes(code) || gust > 80) return { t: t("wxFail"), cls: "fail" };
    if (wind > 45 || gust > 60 || [61, 63, 80, 81, 71, 73].includes(code))
      return { t: t("wxHold"), cls: "hold" };
    return { t: t("wxGo"), cls: "go" };
  }

  async function loadWeather(pad) {
    const body = $("weather-body");
    const spark = $("wind-spark");
    const callEl = $("wx-call");
    if (!pad || pad.latitude == null || pad.longitude == null) {
      body.innerHTML = `<div class="muted">${t("noCoords")}</div>`;
      spark.innerHTML = "";
      callEl.textContent = "—";
      callEl.className = "wx-call";
      return;
    }
    const lat = +pad.latitude;
    const lng = +pad.longitude;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,cloud_cover,visibility` +
      `&hourly=wind_speed_10m,cloud_cover&forecast_days=1&timezone=auto`;
    try {
      const data = await getJSON(url);
      const c = data.current || {};
      const label = (state.lang === "fa" ? WMO : WMO_EN)[c.weather_code] || t("conditions");
      const vis = c.visibility != null ? `${fa(Math.round(c.visibility / 1000))} ${t("visKm")}` : "—";
      const call = weatherCall(c);
      callEl.textContent = call.t;
      callEl.className = `wx-call ${call.cls}`;
      body.innerHTML = `
        <div class="w-main"><span class="temp" dir="ltr">${Math.round(c.temperature_2m)}°</span>
          <span class="w-label">${label}</span></div>
        <div class="kv">${t("wind")} <b>${fa(Math.round(c.wind_speed_10m))} ${t("kmh")}</b></div>
        <div class="kv">${t("gusts")} <b>${fa(Math.round(c.wind_gusts_10m || 0))} ${t("kmh")}</b></div>
        <div class="kv">${t("cloud")} <b>${fa(c.cloud_cover ?? "—")}%</b></div>
        <div class="kv">${vis}</div>`;
      const winds = (data.hourly?.wind_speed_10m || []).slice(0, 16);
      if (winds.length > 1) {
        const max = Math.max(...winds, 1);
        const pts = winds
          .map((w, i) => {
            const x = (i / (winds.length - 1)) * 120;
            const y = 26 - (w / max) * 22;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");
        spark.innerHTML = `<polyline fill="none" stroke="#8ad7ff" stroke-width="1.6" points="${pts}" />`;
      } else spark.innerHTML = "";
    } catch (_) {
      body.innerHTML = `<div class="muted">${t("wxOffline")}</div>`;
    }
  }

  function listForGlobe() {
    return state.tab === "upcoming" ? state.upcoming : [...state.upcoming, ...state.previous];
  }

  function globePoints() {
    const pts = [];
    const seen = new Set();
    for (const l of listForGlobe()) {
      const pad = padOf(l);
      if (pad.latitude == null || pad.longitude == null) continue;
      const key = padKey(pad);
      if (seen.has(key)) continue;
      seen.add(key);
      const selected = state.selected && padKey(padOf(state.selected)) === key;
      pts.push({
        lat: +pad.latitude,
        lng: +pad.longitude,
        color: selected ? "#ff5c33" : "#ffb088",
        radius: selected ? 0.55 : 0.28,
        alt: selected ? 0.02 : 0.01,
        label: pad.name,
        id: l.id,
      });
    }
    for (const s of state.sats) {
      if (s.lat == null || s.lng == null) continue;
      const tracked = s.id === state.trackedId;
      const station = s.group === "stations";
      pts.push({
        lat: s.lat,
        lng: s.lng,
        color: tracked ? "#ffffff" : station ? "#8ad7ff" : "#ff5c33",
        radius: tracked ? 0.5 : station ? 0.32 : 0.18,
        alt: Math.min(0.22, Math.max(0.02, (s.alt || 400) / 6371)),
        label: s.name,
        id: `sat-${s.id}`,
        satId: s.id,
      });
    }
    return pts;
  }

  function globeRings() {
    const rings = [];
    if (state.iss) {
      rings.push({
        lat: state.iss.latitude,
        lng: state.iss.longitude,
        color: (t) => `rgba(138,215,255,${1 - t})`,
        maxR: 4,
        speed: 2.4,
        repeat: 1400,
      });
    }
    const pad = state.selected && padOf(state.selected);
    if (pad && pad.latitude != null) {
      rings.push({
        lat: +pad.latitude,
        lng: +pad.longitude,
        color: (t) => `rgba(255,92,51,${1 - t})`,
        maxR: 3,
        speed: 1.8,
        repeat: 1800,
      });
    }
    return rings;
  }

  function globePath() {
    if (state.issPath.length < 2) return [];
    return [{ coords: state.issPath.map((p) => [p.lat, p.lng]) }];
  }

  function applyGlobeData() {
    if (!state.globe) return;
    state.globe
      .pointsData(globePoints())
      .pointLat("lat")
      .pointLng("lng")
      .pointColor("color")
      .pointRadius("radius")
      .pointAltitude("alt")
      .ringsData(globeRings())
      .ringLat("lat")
      .ringLng("lng")
      .ringColor("color")
      .ringMaxRadius("maxR")
      .ringPropagationSpeed("speed")
      .ringRepeatPeriod("repeat")
      .pathsData(globePath())
      .pathPoints("coords")
      .pathColor(() => ["rgba(138,215,255,0.05)", "rgba(138,215,255,0.85)"])
      .pathStroke(1.1)
      .pathPointAlt(0.03);
  }

  function project(lat, lng, w, h) {
    return [((Number(lng) + 180) / 360) * w, ((90 - Number(lat)) / 180) * h];
  }

  function renderFlat() {
    const box = $("flat-map");
    if (box.hidden) return;
    const w = box.clientWidth;
    const h = box.clientHeight;
    const bits = [];
    for (const l of listForGlobe()) {
      const pad = padOf(l);
      if (pad.latitude == null) continue;
      const [x, y] = project(pad.latitude, pad.longitude, w, h);
      bits.push(`<div class="dot" style="left:${x}px;top:${y}px" title="${escapeAttr(pad.name)}"></div>`);
    }
    for (const s of state.sats) {
      if (s.lat == null) continue;
      const [x, y] = project(s.lat, s.lng, w, h);
      const cls = s.group === "stations" || s.id === state.trackedId ? "iss" : "";
      bits.push(`<div class="dot ${cls}" style="left:${x}px;top:${y}px" title="${escapeAttr(s.name)}"></div>`);
    }
    box.innerHTML = bits.join("");
  }

  function hasWebGL() {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch (_) {
      return false;
    }
  }

  function initGlobe() {
    const el = $("globe");
    if (!hasWebGL() || typeof Globe !== "function") {
      state.flat = true;
      el.style.display = "none";
      $("flat-map").hidden = false;
      renderFlat();
      window.addEventListener("resize", renderFlat);
      return;
    }
    const globe = Globe()(el)
      .globeImageUrl("./assets/earth-night.jpg")
      .bumpImageUrl("./assets/earth-topology.png")
      .backgroundColor("rgba(7,8,11,0)")
      .showAtmosphere(true)
      .atmosphereColor("#9eb8c8")
      .atmosphereAltitude(0.18)
      .width(el.clientWidth)
      .height(el.clientHeight);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;
    globe.controls().enableDamping = true;
    globe.pointOfView({ lat: 18, lng: 52, altitude: 2.35 });

    globe.onPointClick((p) => {
      if (!p) return;
      if (p.satId != null) {
        const sat = state.sats.find((s) => s.id === p.satId);
        if (sat) {
          state.trackedId = sat.id;
          flySat(sat);
          if (state.tab === "orbit") renderSatList();
        }
        return;
      }
      const hit =
        state.upcoming.find((l) => l.id === p.id) ||
        state.previous.find((l) => l.id === p.id);
      if (hit) selectLaunch(hit, true);
    });

    globe.controls().addEventListener("start", () => {
      if (state.spinning) {
        state.spinning = false;
        globe.controls().autoRotate = false;
        $("spin-btn").classList.remove("on");
      }
    });

    state.globe = globe;
    applyGlobeData();

    window.addEventListener("resize", () => {
      globe.width(el.clientWidth);
      globe.height(el.clientHeight);
    });
  }

  function flyToPad(pad) {
    if (!pad || pad.latitude == null) return;
    if (state.globe) {
      state.globe.controls().autoRotate = false;
      state.spinning = false;
      $("spin-btn").classList.remove("on");
      state.globe.pointOfView({ lat: +pad.latitude, lng: +pad.longitude, altitude: 1.55 }, 1100);
    }
  }

  function flyISS() {
    const tr = trackedSat();
    if (tr) flySat(tr);
    else if (state.iss && state.globe) {
      state.globe.controls().autoRotate = false;
      state.spinning = false;
      $("spin-btn").classList.remove("on");
      state.globe.pointOfView(
        { lat: state.iss.latitude, lng: state.iss.longitude, altitude: 1.4 },
        900
      );
    }
  }

  function toggleSpin() {
    if (!state.globe) return;
    state.spinning = !state.spinning;
    state.globe.controls().autoRotate = state.spinning;
    $("spin-btn").classList.toggle("on", state.spinning);
  }

  function selectLaunch(launch, fly) {
    state.selected = launch;
    renderList();
    renderMission();
    tickCountdown();
    loadWeather(padOf(launch));
    applyGlobeData();
    renderFlat();
    if (fly) flyToPad(padOf(launch));
    syncFavBtn();
  }

  function selectDefault() {
    const now = Date.now();
    const next = state.upcoming.find((l) => new Date(l.net).getTime() > now) || state.upcoming[0];
    if (next) selectLaunch(next, false);
  }

  async function trackISS() {
    const pull = async () => {
      try {
        const d = await getJSON("https://api.wheretheiss.at/v1/satellites/25544");
        state.iss = d;
        $("iss-coords").textContent =
          `${d.latitude.toFixed(2)}°  ${d.longitude.toFixed(2)}°  ·  ${Math.round(d.altitude)} km  ·  ${Math.round(d.velocity)} km/h`;
        $("stat-vis").textContent = VIS_FA[d.visibility] || d.visibility || "—";
        applyGlobeData();
        renderFlat();
      } catch (_) {
        $("iss-coords").textContent = t("issLost");
      }
    };

    const pullPath = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const ts = Array.from({ length: 10 }, (_, i) => now + i * 540).join(",");
        const path = await getJSON(
          `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${ts}&units=kilometers`
        );
        if (Array.isArray(path)) {
          state.issPath = path.map((p) => ({ lat: p.latitude, lng: p.longitude }));
        }
      } catch (_) { /* optional */ }
    };

    await pullPath();
    await pull();
    setInterval(pull, 4000);
    setInterval(pullPath, 120000);
  }

  function applyTheme() {
    const id = state.theme || "dark";
    document.documentElement.setAttribute("data-theme", id);
    try { localStorage.setItem("apogee-theme", id); } catch (_) {}
    document.querySelectorAll("[data-theme]").forEach((b) => {
      b.classList.toggle("on", b.dataset.theme === id);
    });
  }
  function setTheme(id) {
    state.theme = id || "dark";
    applyTheme();
  }
  function isFav(id) {
    return (state.favs || []).some((f) => String(f.id) === String(id));
  }
  function syncFavBtn() {
    const b = $("fav-btn");
    if (!b) return;
    b.classList.toggle("on", !!(state.selected && isFav(state.selected.id)));
  }
  function toggleFav() {
    const l = state.selected;
    if (!l) return;
    if (isFav(l.id)) state.favs = state.favs.filter((f) => String(f.id) !== String(l.id));
    else {
      state.favs = [{ id: l.id, name: missionName(l), net: l.net, image: imgOf(l.image) }, ...state.favs].slice(0, 40);
    }
    try { localStorage.setItem("apogee-favs", JSON.stringify(state.favs)); } catch (_) {}
    syncFavBtn();
    if (state.filter === "fav") renderList();
  }
  async function shareMission() {
    const l = state.selected;
    const url = "https://pillow1243.github.io/APOGEE/";
    const text = l
      ? `${missionName(l)} · ${vehicleName(l)} · ${whenLine(l.net)} — APOGEE`
      : "APOGEE — Live range control · Mobin.A";
    try {
      if (navigator.share) {
        await navigator.share({ title: "APOGEE", text, url });
        return;
      }
    } catch (_) {}
    try {
      await navigator.clipboard.writeText(text + "\n" + url);
      toast(t("copied"));
    } catch (_) {}
  }
  function toast(msg) {
    let el = $("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.style.cssText = "position:fixed;bottom:88px;left:50%;transform:translateX(-50%);z-index:70;background:#12141a;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:8px 16px;font-weight:700;font-size:13px";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 1600);
  }

  function crowdHash(n) {
    n = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
    n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function iranHour() {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tehran", hour: "numeric", minute: "numeric", hourCycle: "h23",
      }).formatToParts(new Date());
      let h = 0, m = 0;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].type === "hour") h = Number(parts[i].value);
        if (parts[i].type === "minute") m = Number(parts[i].value);
      }
      return h + m / 60;
    } catch (_) {
      const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
      const t = new Date(utc + 3.5 * 3600000);
      return t.getHours() + t.getMinutes() / 60;
    }
  }
  function crowdBase(h) {
    const pts = [
      [0, 38200], [1.5, 24600], [3, 15800], [5, 17200],
      [7, 26800], [9.5, 44800], [12, 62400], [13.5, 65800],
      [16, 81200], [18.5, 96800], [21, 106400], [22.2, 107600],
      [23.4, 84200], [24, 38200],
    ];
    let i = 0;
    while (i < pts.length - 1 && h > pts[i + 1][0]) i += 1;
    const a = pts[i], b = pts[i + 1];
    const p = (h - a[0]) / ((b[0] - a[0]) || 1);
    const s = p * p * (3 - 2 * p);
    return a[1] + (b[1] - a[1]) * s;
  }
  function crowdNow() {
    const tick = Math.floor(Date.now() / 3000);
    const h = crowdHash(tick * 2654435761 + 11 * 97);
    const h2 = crowdHash(tick * 1597334677 + 11 * 13);
    const jitter = (h - 0.5) * 1600 + (h2 - 0.5) * 600;
    let n = Math.round(crowdBase(iranHour()) * 0.88 + jitter);
    if (n < 8200) n = 8200;
    if (n > 112800) n = 112800;
    return n;
  }
  function fmtCrowd(n) {
    try { return n.toLocaleString("en-US"); } catch (_) { return String(n); }
  }
  function renderLive() {
    const n = crowdNow();
    const nb = $("live-n");
    if (nb) nb.textContent = fmtCrowd(n);
    const pill = $("live-pill");
    if (pill) {
      const span = pill.querySelector("[data-i18n='online']");
      if (span) span.textContent = t("online");
    }
  }
  function startLive() {
    renderLive();
    setInterval(renderLive, 3000);
  }

  function flareClass(flux) {
    const f = Number(flux) || 0;
    if (f >= 1e-4) return "X" + (f / 1e-4).toFixed(1);
    if (f >= 1e-5) return "M" + (f / 1e-5).toFixed(1);
    if (f >= 1e-6) return "C" + (f / 1e-6).toFixed(1);
    if (f >= 1e-7) return "B" + (f / 1e-7).toFixed(1);
    return "A" + (f / 1e-8).toFixed(1);
  }
  async function loadSpaceWx() {
    const [kpPack, xr] = await Promise.all([
      getJSON("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"),
      getJSON("https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json"),
    ]);
    const lastKp = Array.isArray(kpPack) ? kpPack[kpPack.length - 1] : null;
    const lastXr = Array.isArray(xr) ? xr.filter((x) => String(x.energy || "").indexOf("0.1") >= 0).pop() || xr[xr.length - 1] : null;
    state.spaceWx = {
      kp: lastKp ? Number(lastKp.Kp != null ? lastKp.Kp : lastKp[1]) : 0,
      flare: lastXr ? flareClass(lastXr.flux) : "—",
    };
    renderSpaceWx();
  }
  function renderSpaceWx() {
    const box = $("space-wx-body");
    if (!box) return;
    const wx = state.spaceWx;
    if (!wx) {
      box.innerHTML = `<div class="muted">${t("sensors")}</div>`;
      return;
    }
    const kp = wx.kp || 0;
    const storm = kp >= 5;
    const pct = Math.min(100, (kp / 9) * 100);
    box.innerHTML =
      `<div class="wx-grid">
        <div class="wx-cell"><span class="k">${t("kp")}</span><span class="v">${kp.toFixed(1)}</span><span class="s">${storm ? t("storm") : t("quiet")}</span></div>
        <div class="wx-cell"><span class="k">${t("flare")}</span><span class="v">${wx.flare}</span><span class="s">GOES</span></div>
        <div class="wx-cell"><span class="k">${t("aurora")}</span><span class="v">${storm ? "G1+" : "G0"}</span><span class="s">${storm ? t("storm") : t("quiet")}</span></div>
      </div>
      <div class="kp-bar"><i style="width:${pct}%"></i></div>`;
  }

  function moonInfo(date) {
    const syn = 29.53058867;
    const known = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
    const now = date.getTime() / 86400000;
    const age = ((now - known) % syn + syn) % syn;
    const illum = (1 - Math.cos((2 * Math.PI * age) / syn)) / 2;
    const names = dict().moonNames || [];
    const idx = Math.round((age / syn) * 8) % 8;
    return { age, illum, name: names[idx] || "" };
  }
  function renderMoon() {
    const box = $("moon-body");
    if (!box) return;
    const m = moonInfo(new Date());
    const shift = Math.round((m.age / 29.53058867) * 18) - 9;
    box.innerHTML =
      `<div class="moon-row">
        <div class="moon-face" style="box-shadow: inset ${shift}px 0 0 rgba(7,8,11,0.62), 0 0 16px rgba(255,204,102,0.18)"></div>
        <div><b>${t("moon")} · ${m.name}</b><div class="muted">${Math.round(m.illum * 100)}%</div></div>
      </div>`;
  }

  function sunElevation(date, lat, lng) {
    const rad = Math.PI / 180;
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    const day = (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000;
    const decl = -23.44 * Math.cos(((360 / 365) * (day + 10)) * rad);
    const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const ha = (utcH - 12) * 15 + lng;
    const sinAlt = Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(ha * rad);
    return Math.asin(Math.min(1, Math.max(-1, sinAlt))) / rad;
  }
  function lookAt(satrec, date, lat, lng) {
    const gmst = satellite.gstime(date);
    const pv = satellite.propagate(satrec, date);
    if (!pv || !pv.position) return null;
    const ecf = satellite.eciToEcf(pv.position, gmst);
    const gd = {
      longitude: satellite.degreesToRadians(lng),
      latitude: satellite.degreesToRadians(lat),
      height: 0.05,
    };
    return satellite.ecfToLookAngles(gd, ecf);
  }
  function computePasses(satrec, lat, lng) {
    const start = Date.now();
    const end = start + 16 * 3600 * 1000;
    const step = 25000;
    const out = [];
    let cur = null;
    for (let t = start; t < end; t += step) {
      const date = new Date(t);
      let look = null;
      try { look = lookAt(satrec, date, lat, lng); } catch (_) { look = null; }
      if (!look) continue;
      const el = look.elevation * 180 / Math.PI;
      const sun = sunElevation(date, lat, lng);
      if (el > 10) {
        if (!cur) cur = { aos: date, maxEl: el, dark: sun < -6 };
        if (el > cur.maxEl) cur.maxEl = el;
        cur.los = date;
        if (sun < -6) cur.dark = true;
      } else if (cur) {
        if (cur.dark && cur.los - cur.aos > 60000) out.push(cur);
        cur = null;
        if (out.length >= 2) break;
      }
    }
    return out;
  }
  function azName(az) {
    const d = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return d[Math.round((((az % 360) + 360) % 360) / 45) % 8];
  }
  function renderSky() {
    renderMoon();
    const box = $("pass-body");
    if (!box) return;
    if (!state.observer) {
      box.innerHTML = `<div class="muted" style="margin-top:8px">${t("locating")}</div>`;
      return;
    }
    const passes = state.passes || [];
    if (!passes.length) {
      box.innerHTML = `<div class="muted" style="margin-top:8px">${t("noPass")}</div>`;
      return;
    }
    box.innerHTML = `<div class="card-k" style="margin-top:12px">${t("nextPass")}</div>` + passes.map((p) => {
      const mins = Math.max(1, Math.round((p.los - p.aos) / 60000));
      return `<div class="pass-row"><div><b dir="ltr">${p.aos.toLocaleTimeString(state.lang === "fa" ? "fa-IR" : "en-GB", { hour: "2-digit", minute: "2-digit" })}</b>
        <span>${t("maxEl")} ${Math.round(p.maxEl)}° · ${t("duration")} ${mins}m</span></div></div>`;
    }).join("");
  }
  function locateSky() {
    const done = (lat, lng) => {
      state.observer = { lat, lng };
      const iss = (state.sats || []).find((s) => /ISS/i.test(s.name) && /ZARYA/i.test(s.name));
      if (iss && iss.satrec && hasSatLib()) {
        try { state.passes = computePasses(iss.satrec, lat, lng); }
        catch (_) { state.passes = []; }
      }
      renderSky();
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => done(pos.coords.latitude, pos.coords.longitude),
        () => done(35.6892, 51.389),
        { timeout: 2800, maximumAge: 600000 }
      );
    } else done(35.6892, 51.389);
  }

  async function loadNews() {
    const data = await getJSON("https://api.spaceflightnewsapi.net/v4/articles/?limit=10");
    state.news = data.results || [];
    renderNews();
  }
  function renderNews() {
    const track = $("ticker-track");
    const wrap = $("ticker");
    if (!track || !wrap) return;
    if (!state.news.length) { wrap.hidden = true; return; }
    const bits = state.news.map((n) =>
      `<a href="${escapeAttr(n.url)}" target="_blank" rel="noopener">${escapeAttr(n.news_site || "News")} — ${escapeAttr(n.title)}</a>`
    );
    track.innerHTML = bits.concat(bits).join("");
    wrap.hidden = false;
  }

  async function loadEvents() {
    const data = await getJSON("https://ll.thespacedevs.com/2.2.0/event/upcoming/?limit=16");
    state.events = data.results || [];
    if (state.tab === "events") renderEvents();
  }
  function eventTypeName(ev) {
    const raw = ev.type?.name || "Other";
    const pack = dict().eventTypes || {};
    return pack[raw] || pack.Other || raw;
  }
  function renderEvents() {
    const list = (state.events || []).filter((ev) => {
      const q = state.q.trim().toLowerCase();
      if (!q) return true;
      return `${ev.name} ${ev.location || ""} ${ev.type?.name || ""}`.toLowerCase().indexOf(q) >= 0;
    });
    $("list-count").textContent = fa(list.length);
    if (!list.length) {
      $("launch-list").innerHTML = `<div class="card muted" style="padding:14px">${t("empty")}</div>`;
      return;
    }
    $("launch-list").innerHTML = list.map((ev) => {
      return `<button class="event-item" data-event-id="${ev.id}" type="button">
        <div class="etype">${eventTypeName(ev)}</div>
        <div class="title" dir="ltr">${escapeAttr(ev.name)}</div>
        <div class="sub muted">${relTime(ev.date)} · ${escapeAttr(ev.location || "")}</div>
      </button>`;
    }).join("");
  }
  function openEvent(ev) {
    if (!ev) return;
    $("mission-name").textContent = ev.name || "—";
    $("mission-desc").textContent = ev.description || t("noDesc");
    $("mission-chips").innerHTML = `<span class="chip">${eventTypeName(ev)}</span>`;
    $("when-line").textContent = whenLine(ev.date);
    $("status-pill").textContent = eventTypeName(ev);
    $("status-pill").className = "pill go";
    $("pad-line").textContent = ev.location || "—";
    const img = ev.feature_image;
    $("hero-photo").style.backgroundImage = img ? `url('${escapeAttr(img)}')` : "none";
    const btn = $("webcast-btn");
    if (ev.video_url) { btn.href = ev.video_url; btn.hidden = false; }
    else btn.hidden = true;
    $("prob-wrap").hidden = true;
  }

  async function loadApod() {
    const data = await getJSON("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    if (!data || data.media_type !== "image" || !data.url) return;
    state.apod = data;
    renderApod();
  }
  function renderApod() {
    const card = $("apod-card");
    const hit = $("apod-hit");
    if (!card || !hit || !state.apod) return;
    card.hidden = false;
    hit.innerHTML = `<img src="${escapeAttr(state.apod.url)}" alt="">
      <p dir="ltr">${escapeAttr(state.apod.title || "")}</p>`;
    hit.onclick = () => {
      if (state.apod.hdurl || state.apod.url) window.open(state.apod.hdurl || state.apod.url, "_blank", "noopener");
    };
  }

  function bindUI() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((tb) => tb.classList.toggle("on", tb === tab));
        state.tab = tab.dataset.tab;
        syncTabChrome();
        renderList();
        applyGlobeData();
        renderFlat();
      });
    });
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("on", b === btn));
        state.filter = btn.dataset.filter;
        renderList();
      });
    });
    $("search").addEventListener("input", (e) => {
      state.q = e.target.value || "";
      renderList();
    });
    document.querySelectorAll("[data-sat-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-sat-filter]").forEach((b) => b.classList.toggle("on", b === btn));
        state.satFilter = btn.dataset.satFilter;
        renderSatList();
      });
    });
    $("launch-list").addEventListener("click", (e) => {
      const satBtn = e.target.closest("[data-sat-id]");
      if (satBtn) {
        const id = Number(satBtn.getAttribute("data-sat-id"));
        const sat = state.sats.find((s) => s.id === id);
        if (sat) {
          state.trackedId = sat.id;
          renderSatList();
          flySat(sat);
        }
        return;
      }
      const btn = e.target.closest("[data-id]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const l =
        state.upcoming.find((x) => String(x.id) === id) ||
        state.previous.find((x) => String(x.id) === id);
      if (l) selectLaunch(l, true);
    });
    $("fly-btn").addEventListener("click", () => flyToPad(padOf(state.selected)));
    $("spin-btn").addEventListener("click", toggleSpin);
    $("iss-chip").addEventListener("click", flyISS);
    $("spin-btn").classList.add("on");
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.addEventListener("click", () => setLang(b.dataset.lang));
    });
    const layers = [];
    let ignorePop = 0;
    function pushLayer(id) {
      if (layers[layers.length - 1] === id) return;
      layers.push(id);
    }
    function dropLayer(id, fromPop) {
    const i = layers.lastIndexOf(id);
    if (i >= 0) layers.splice(i, 1);
  }
    function openAbout() {
      const el = $("about");
      if (el && el.hidden) pushLayer("about");
      if (el) el.hidden = false;
    }
    function closeAbout(fromPop) {
      const el = $("about");
      const was = el && !el.hidden;
      if (el) el.hidden = true;
      if (was) dropLayer("about", fromPop);
    }
    function openSettings() {
      const el = $("settings");
      if (!el) return;
      if (el.hidden) pushLayer("settings");
      el.hidden = false;
      $("settings-btn") && $("settings-btn").classList.add("on");
    }
    function closeSettings(fromPop) {
      const el = $("settings");
      const was = el && !el.hidden;
      if (el) el.hidden = true;
      $("settings-btn") && $("settings-btn").classList.remove("on");
      if (was) dropLayer("settings", fromPop);
    }
    function consumeBack() {
      const id = layers[layers.length - 1];
      if (!id) return false;
      if (id === "settings") closeSettings(true);
      else closeAbout(true);
      return true;
    }
    try { history.scrollRestoration = "manual"; } catch (_) {}
    try {
      if (!history.state || !history.state.keep) history.replaceState({ keep: "root" }, "");
      history.pushState({ keep: "live" }, "");
    } catch (_) {}
    addEventListener("popstate", () => {
      if (ignorePop) { ignorePop -= 1; return; }
      if (consumeBack()) {
        try { history.pushState({ keep: "live" }, ""); } catch (_) {}
      }
    });
    document.addEventListener("backbutton", (e) => {
      if (consumeBack()) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    window.AndroidBack = consumeBack;
    window.onBackPressed = consumeBack;
    $("about-btn").addEventListener("click", openAbout);
    $("about-close").addEventListener("click", () => closeAbout());
    $("about").addEventListener("click", (e) => {
      if (e.target.id === "about") closeAbout();
    });
    document.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.dataset.act === "settings") {
        const el = $("settings");
        if (el && el.hidden) openSettings();
        else closeSettings();
      } else if (act.dataset.act === "fav") toggleFav();
      else if (act.dataset.act === "share") shareMission();
    });
    const themeRow = $("theme-row");
    if (themeRow) {
      themeRow.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-theme]");
        if (btn) setTheme(btn.dataset.theme);
      });
    }
    const settingsEl = $("settings");
    if (settingsEl) settingsEl.addEventListener("click", (e) => {
      if (e.target.id === "settings") closeSettings();
    });
    $("launch-list").addEventListener("click", (e) => {
      const evBtn = e.target.closest("[data-event-id]");
      if (!evBtn) return;
      const ev = (state.events || []).find((x) => String(x.id) === evBtn.getAttribute("data-event-id"));
      if (ev) openEvent(ev);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (consumeBack()) return;
        closeAbout();
        closeSettings();
      }
      if (e.keyCode === 4 && consumeBack()) e.preventDefault();
    });

    window.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key !== "j" && e.key !== "k" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const list = visibleList();
      const i = list.findIndex((x) => state.selected && x.id === state.selected.id);
      const dir = e.key === "j" || e.key === "ArrowDown" ? 1 : -1;
      const n = list[i + dir];
      if (n) selectLaunch(n, true);
    });
  }

  async function refreshFeeds() {
    try {
      await Promise.all([loadLaunches(), loadPrevious()]);
      if (state.selected) {
        const fresh =
          state.upcoming.find((l) => l.id === state.selected.id) ||
          state.previous.find((l) => l.id === state.selected.id);
        if (fresh) state.selected = fresh;
      } else {
        selectDefault();
      }
      renderList();
      renderMission();
      renderStats();
      applyGlobeData();
      stampFresh();
    } catch (_) { /* keep last good snapshot */ }
  }

  async function refreshCrew() {
    try {
      await loadCrew();
      renderCrew();
      renderStats();
    } catch (_) { /* keep */ }
  }

  async function loadExtras() {
    await Promise.all([
      loadSpaceWx().catch(() => {}),
      loadNews().catch(() => {}),
      loadEvents().catch(() => {}),
      loadApod().catch(() => {}),
    ]);
    renderMoon();
    locateSky();
  }

  async function boot() {
    try { state.favs = safeParse("apogee-favs", []); } catch (_) { state.favs = []; }
    applyTheme();
    applyI18n();
    startLive();
    tickClocks();
    setInterval(tickClocks, 1000);
    setInterval(tickCountdown, 250);
    setInterval(renderList, 15000);
    setInterval(refreshFeeds, 180000);
    setInterval(refreshCrew, 600000);
    setInterval(() => {
      if (state.selected) loadWeather(padOf(state.selected));
    }, 300000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshFeeds();
    });
    bindUI();
    try {
      $("load-sub").textContent = t("loadLock");
      await Promise.all([
        loadLaunches(),
        loadPrevious(),
        loadCrew().catch(() => {
          state.crew = [];
        }),
        loadCatalog().catch(() => {
          state.sats = [];
        }),
      ]);
      tickSats();
      syncTabChrome();
      renderCrew();
      renderStats();
      selectDefault();
      stampFresh();
      $("load-sub").textContent = t("loadGlobe");
      initGlobe();
      trackISS();
      $("loader").classList.add("off");
      loadExtras();
    } catch (err) {
      $("load-sub").textContent = t("rangeFault") + " — " + err.message;
    }
  }

  boot();
})();
